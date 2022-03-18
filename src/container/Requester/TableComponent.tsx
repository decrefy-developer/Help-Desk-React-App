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
} from "@chakra-ui/react";
import moment from "moment";
import { useContext } from "react";
import { FaEllipsisH } from "react-icons/fa";
import { io } from "socket.io-client";
import StyleContext from "../../context/StyleContext";
import {
  ACCESS,
  IFormTicketData,
  IRequest,
  ITeam,
  IUser,
  ListResponse,
} from "../../models/interface";
import { DecodeToken } from "../../utils/decode-token";
import StringTruncate from "../../utils/StringTruncate";

interface Props {
  data: ListResponse<IRequest> | undefined;
  padding: number;
  rowId: string;
  openDrawer: (data: IRequest) => void;
  openModal: (_id: string) => void
}

const TableComponent: React.FC<Props> = ({
  data,
  padding,
  rowId,
  openDrawer,
  openModal
}) => {
  const rowBgColor = useColorModeValue("gray.400", "gray.700");
  const decoded: IUser | null = DecodeToken();

  const styleAsTd = {
    fontSize: "sm",
    fontWeight: "normal",
    display: "flex",
    alignItems: "center",
  };

  return (
    <Flex mx={padding}>
      <Stack
        direction={{ base: "column" }}
        w="full"
        spacing={{ base: "3", md: "0" }}
      >
        <SimpleGrid
          display={{ base: "none", md: "grid" }}
          spacingY={3}
          columns={{ base: 1, md: 5 }}
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
          <Text color="accent" fontWeight="normal">
            Concern
          </Text>
          <Text color="accent" fontWeight="normal">
            Ticket #
          </Text>
          <Text color="accent" fontWeight="normal">
            Status
          </Text>
          <Text></Text>
        </SimpleGrid>
        {data?.docs.map((item) => {
          return (
            <Flex direction={{ base: "row", md: "column" }} key={item._id}>
              <SimpleGrid
                spacingY={3}
                columns={{ base: 1, md: 5 }}
                w="full"
                py={2}
                px={10}
                fontWeight="hairline"
                borderBottom="1px"
                borderRight="1px"
                borderLeft="1px"
                borderTop={{ base: "1px", md: "0px" }}
                borderColor={rowBgColor}
                alignItems="center"
                justifyContent="center"
                bgColor={rowId === item._id ? "gray.700" : "none"}
              >
                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: "inline", md: "none" }}
                    mr={2}
                  >
                    Date requested:
                  </Text>
                  {moment(item.updatedAt).format("MMM DD, YYYY")}
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: "inline", md: "none" }}
                    mr={2}
                  >
                    Concern:
                  </Text>

                  {StringTruncate(item.concern, 30)}
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: "inline", md: "none" }}
                    mr={2}
                  >
                    Ticket #
                  </Text>

                  {item.ticket?.ticketNumber}
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: "inline", md: "none" }}
                    mr={2}
                  >
                    Status
                  </Text>
                  <Badge colorScheme={item.ticket?.state === "PENDING" ? "yellow" : "green"}>{item.ticket?.state}</Badge>
                </Box>

                <Box {...styleAsTd} justifyContent="space-between">
                  <Menu isLazy>
                    <MenuButton color="primary">
                      <Icon as={FaEllipsisH} />
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => openModal(item._id)}>View details</MenuItem>
                      {decoded && !item.ticket?.ticketNumber &&
                        decoded.priviledge.includes(ACCESS.CREATE_TICKET) && (
                          <MenuItem onClick={() => openDrawer({
                            _id: item._id,
                            concern: item.concern,
                            isSeen: item.isSeen,
                            user: item.user
                          })}>Create ticket</MenuItem>
                        )}
                    </MenuList>
                  </Menu>

                  {!item.isSeen && (
                    <Tooltip label="not yet seen by the admin">
                      <Icon viewBox='0 0 200 200' color='primary'>
                        <path
                          fill='currentColor'
                          d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
                        />
                      </Icon>
                    </Tooltip>
                  )}
                </Box>
              </SimpleGrid>
            </Flex>
          );
        })}
      </Stack>
    </Flex >
  );
};

export default TableComponent;
