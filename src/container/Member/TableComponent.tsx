import {
  Avatar,
  Badge,
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
} from "@chakra-ui/react";
import moment from "moment";
import { FaEllipsisH } from "react-icons/fa";
import { IMember, ListResponse } from "../../models/interface";
import StringTruncate from "../../utils/StringTruncate";

const TableComponent: React.FC<{
  data: ListResponse<IMember> | undefined;
  viewTeamAndChannel: (_id: string) => void;
  ViewChangeAccess: (_id: string) => void;
  ViewResetPassword: (_id: string) => void;
  ViewChangeStatus: (_id: string, isActive: boolean) => void;
  rowId: string;
  padding: number;
}> = ({
  data,
  viewTeamAndChannel,
  rowId,
  ViewChangeAccess,
  ViewResetPassword,
  ViewChangeStatus,
  padding,
}) => {
  const rowBgColor = useColorModeValue("gray.400", "gray.700");
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
            Email
          </Text>
          <Text color="accent" fontWeight="normal">
            Account Access
          </Text>
          <Text color="accent" fontWeight="normal">
            Status
          </Text>
          <Text color="accent" fontWeight="normal">
            Last Modified
          </Text>
          <Text></Text>
        </SimpleGrid>
        {data?.docs.map((user) => {
          return (
            <Flex direction={{ base: "row", md: "column" }} key={user._id}>
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
                bgColor={rowId === user._id ? "gray.700" : "none"}
              >
                <Flex alignItems="center">
                  <Avatar name={user.email} size="sm" bg="accent" />
                  <Text mx={2} fontSize="sm" fontWeight="normal">
                    {user.email}
                  </Text>
                </Flex>

                <Text fontSize="sm" fontWeight="normal">
                  [{" "}
                  {StringTruncate(
                    user.priviledge.join(" , ").toLowerCase(),
                    30
                  )}{" "}
                  ]
                </Text>

                <Text fontSize="sm" fontWeight="normal">
                  {user.isActive ? (
                    <Badge colorScheme="green">Active</Badge>
                  ) : (
                    <Badge colorScheme="red">Deactivated</Badge>
                  )}
                </Text>

                <Text fontSize="sm" fontWeight="normal">
                  {moment(user.updatedAt).format("MMM DD, YYYY")}
                </Text>

                <Menu isLazy>
                  <MenuButton>
                    <Icon as={FaEllipsisH} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => viewTeamAndChannel(user._id)}>
                      View channels
                    </MenuItem>

                    {/* it's will show when the status is active */}
                    {user.isActive === true && (
                      <div>
                        <MenuItem onClick={() => ViewChangeAccess(user._id)}>
                          Change account access
                        </MenuItem>
                        <MenuItem
                          color="warning"
                          onClick={() => ViewResetPassword(user._id)}
                        >
                          Reset password
                        </MenuItem>
                      </div>
                    )}

                    <MenuItem
                      color={user.isActive === true ? "danger" : "success"}
                      onClick={() => ViewChangeStatus(user._id, user.isActive)}
                    >
                      {user.isActive === true
                        ? "Deactivate account"
                        : "Activate account"}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </SimpleGrid>
            </Flex>
          );
        })}
      </Stack>
    </Flex>
  );
};

export default TableComponent;
