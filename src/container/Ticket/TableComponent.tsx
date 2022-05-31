import {
  Box,
  Button,
  Checkbox,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import moment from 'moment';
import { useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import { useFileTicketMutation } from '../../app/features/filling-query';
import { ITicket, ListResponse } from '../../models/interface';
import { toast } from 'react-toastify';

interface Props {
  data: ListResponse<ITicket> | undefined;
  padding: number;
  rowId: string;
  viewDetailsHandler: (data: ITicket) => void;
}

const TableComponent: React.FC<Props> = ({
  data,
  padding,
  rowId,
  viewDetailsHandler,
}) => {
  const rowBgColor = useColorModeValue('gray.400', 'gray.700');
  const [checkedItems, setCheckItems] = useState<Array<string>>([]);
  const [fileTicket] = useFileTicketMutation();

  const styleAsTd = {
    fontSize: 'sm',
    fontWeight: 'normal',
    display: 'flex',
    alignItems: 'baseline',
  };
  console.log(data);

  function onCheck(isChecked: boolean, _id: string) {
    if (isChecked) {
      setCheckItems([...checkedItems, _id]);
    } else {
      setCheckItems(checkedItems.filter((item) => item !== _id));
    }
  }

  async function submitHandler() {
    try {
      const result = await fileTicket({ ticketId: checkedItems }).unwrap();
      if (result) {
        toast.success('ticket successfully filed');
        setCheckItems([]);
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  }

  return (
    <Flex mx={padding}>
      <Stack
        direction={{ base: 'column' }}
        w="full"
        spacing={{ base: '3', md: '0' }}
      >
        <SimpleGrid
          columns={{ base: 1, md: 7 }}
          display={{ base: 'none', md: 'grid' }}
          spacingY={3}
          w="full"
          py={2}
          px={10}
          fontWeight="hairline"
          border="1px"
          borderColor={rowBgColor}
          alignItems="center"
          justifyContent="center"
        >
          <Box>
            {checkedItems.length > 0 && (
              <Button size="xs" onClick={submitHandler}>
                Submit
              </Button>
            )}
          </Box>
          <Text color="accent" fontWeight="normal">
            Ticket #
          </Text>
          <Text color="accent" fontWeight="normal">
            Requester
          </Text>
          <Text color="accent" fontWeight="normal">
            Department
          </Text>
          <Text color="accent" fontWeight="normal">
            Date Created
          </Text>
          <Text color="accent" fontWeight="normal">
            Assigned Channel
          </Text>
          <Text></Text>
        </SimpleGrid>

        {data?.docs.map((item) => {
          return (
            <Flex direction={{ base: 'row', md: 'column' }} key={item._id}>
              <SimpleGrid
                spacingY={3}
                columns={{ base: 1, md: 7 }}
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
                <Box alignItems="center" display="flex">
                  {!item?.isFiled && (
                    <Checkbox
                      size="md"
                      onChange={(e) => onCheck(e.target.checked, item._id)}
                    />
                  )}
                </Box>
                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: 'inline', md: 'none' }}
                    mr={2}
                  >
                    Ticket #:
                  </Text>
                  {item?.ticketNumber}
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: 'inline', md: 'none' }}
                    mr={2}
                  >
                    Requester:
                  </Text>
                  {item?.requesterName}
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: 'inline', md: 'none' }}
                    mr={2}
                  >
                    Department:
                  </Text>
                  {item?.department.name}
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: 'inline', md: 'none' }}
                    mr={2}
                  >
                    Date Created:
                  </Text>
                  {moment(item?.createdAt).format('MM-DD-YYYY, h:mm:ss a')}
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: 'inline', md: 'none' }}
                    mr={2}
                  >
                    Assigned Channel:
                  </Text>
                  {item.channel.name}
                </Box>

                <Box {...styleAsTd}>
                  <Menu isLazy>
                    <MenuButton>
                      <Icon as={FaEllipsisH} />
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => viewDetailsHandler(item)}>
                        View details
                      </MenuItem>
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
