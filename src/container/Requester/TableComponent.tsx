import {
  Badge,
  Box,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import moment from 'moment';
import { FaEllipsisH } from 'react-icons/fa';
import { ACCESS, IRequest, IUser, ListResponse } from '../../models/interface';
import { DecodeToken } from '../../utils/decode-token';
import StringTruncate from '../../utils/StringTruncate';

interface Props {
  data: ListResponse<IRequest> | undefined;
  padding: number;
  rowId: string;
  openDrawer: (data: IRequest) => void;
  openModal: (_id: string) => void;
}

const TableComponent: React.FC<Props> = ({
  data,
  padding,
  rowId,
  openDrawer,
  openModal,
}) => {
  const rowBgColor = useColorModeValue('gray.400', 'gray.700');
  const decoded: IUser | null = DecodeToken();
  const NUMBER_OF_COLUMNS = decoded?.priviledge.includes(ACCESS.CREATE_TICKET)
    ? 7
    : 6;

  const styleAsTd = {
    fontSize: 'sm',
    fontWeight: 'light',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <Flex mx={padding}>
      <Stack
        direction={{ base: 'column' }}
        w="full"
        spacing={{ base: '3', md: '0' }}
      >
        <SimpleGrid
          display={{ base: 'none', md: 'grid' }}
          spacingY={3}
          columns={{ base: 1, md: NUMBER_OF_COLUMNS }}
          w="full"
          py={2}
          px={10}
          fontWeight="hairline"
          border="1px"
          borderColor={rowBgColor}
          alignItems="center"
          justifyContent="center"
        >
          <Text color="accent" fontWeight="normal">
            Date requested
          </Text>
          {decoded?.priviledge.includes(ACCESS.CREATE_TICKET) && (
            <Text color="accent" fontWeight="normal">
              Department
            </Text>
          )}
          <Text color="accent" fontWeight="normal">
            Concern
          </Text>
          <Text color="accent" fontWeight="normal">
            Status
          </Text>
          <Text color="accent" fontWeight="normal">
            Ticket #
          </Text>
          <Text color="accent" fontWeight="normal">
            Assigned support
          </Text>
          <Text></Text>
        </SimpleGrid>
        {data?.docs.map((item) => {
          return (
            <Flex direction={{ base: 'row', md: 'column' }} key={item._id}>
              <SimpleGrid
                spacingY={3}
                columns={{ base: 1, md: NUMBER_OF_COLUMNS }}
                w="full"
                py={2}
                px={10}
                fontWeight="hairline"
                borderBottom="1px"
                borderRight="1px"
                borderLeft="1px"
                borderTop={{ base: '1px', md: '0px' }}
                borderColor={rowBgColor}
                alignItems="center"
                justifyContent="center"
                bgColor={rowId === item._id ? 'gray.700' : 'none'}
              >
                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: 'inline', md: 'none' }}
                    mr={2}
                    fontSize="xs"
                  >
                    Date requested:
                  </Text>
                  {moment(item.updatedAt).format('MMM DD, YYYY, h:mm:ss a')}
                </Box>

                {decoded?.priviledge.includes(ACCESS.CREATE_TICKET) && (
                  <Box {...styleAsTd}>
                    <Text
                      color="accent"
                      display={{ base: 'inline', md: 'none' }}
                      mr={2}
                    >
                      Department
                    </Text>

                    {item.user.department.name.toLowerCase()}
                  </Box>
                )}

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: 'inline', md: 'none' }}
                    mr={2}
                  >
                    Concern:
                  </Text>
                  <Tooltip label={item.concern}>
                    {StringTruncate(item.concern, 30)}
                  </Tooltip>
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: 'inline', md: 'none' }}
                    mr={2}
                  >
                    Status
                  </Text>
                  <Badge colorScheme={item.status ? 'green' : 'yellow'}>
                    {item.ticket ? (item.status ? 'DONE' : 'PENDING') : ''}
                  </Badge>
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: 'inline', md: 'none' }}
                    mr={2}
                  >
                    Ticket #
                  </Text>

                  {item.ticket?.ticketNumber}
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: 'inline', md: 'none' }}
                    mr={2}
                  >
                    Assigned support
                  </Text>
                  {item.ticket?.assignedSupport?.firstName}{' '}
                  {item.ticket?.assignedSupport?.lastName}
                </Box>

                <Box {...styleAsTd}>
                  <Menu isLazy>
                    <MenuButton color="primary">
                      <Icon as={FaEllipsisH} />
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => openModal(item._id)}>
                        View details
                      </MenuItem>
                      {decoded &&
                        !item.ticket?.ticketNumber &&
                        decoded.priviledge.includes(ACCESS.CREATE_TICKET) && (
                          <MenuItem
                            onClick={() =>
                              openDrawer({
                                _id: item._id,
                                concern: item.concern,
                                status: item.status,
                                user: item.user,
                              })
                            }
                          >
                            Create ticket
                          </MenuItem>
                        )}
                    </MenuList>
                  </Menu>
                </Box>
              </SimpleGrid>
            </Flex>
          );
        })}
      </Stack>
    </Flex>
  );
};

export default TableComponent;
