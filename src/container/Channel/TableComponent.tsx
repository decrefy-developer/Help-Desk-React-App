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
  useColorModeValue,
} from "@chakra-ui/react";
import moment from "moment";
import { FaEllipsisH } from "react-icons/fa";
import { IChannel, ListResponse } from "../../models/interface";

interface Props {
  data: ListResponse<IChannel> | undefined;
  padding: number;
  rowId: string;
  ChangeStatusHandler: (_id: string, isActive: boolean) => void;
  ViewMembersHandler: (_id: string) => void;
}

const TableComponent: React.FC<Props> = ({
  data,
  padding,
  rowId,
  ChangeStatusHandler,
  ViewMembersHandler,
}) => {
  const rowBgColor = useColorModeValue("gray.400", "gray.700");

  const styleAsTd = {
    fontSize: "sm",
    fontWeight: "normal",
    display: "flex",
    alignItems: "baseline",
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
          columns={{ base: 1, md: 6 }}
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
            Name
          </Text>

          <Text color="accent" fontWeight="normal">
            Status
          </Text>

          <Text color="accent" fontWeight="normal">
            No of Members
          </Text>

          <Text color="accent" fontWeight="normal">
            Team
          </Text>

          <Text color="accent" fontWeight="normal">
            Last Modified
          </Text>
          <Text></Text>
        </SimpleGrid>
        {data?.docs.map((channel) => {
          return (
            <Flex direction={{ base: "row", md: "column" }} key={channel._id}>
              <SimpleGrid
                spacingY={3}
                columns={{ base: 1, md: 6 }}
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
                bgColor={rowId === channel._id ? "gray.700" : "none"}
              >
                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: "inline", md: "none" }}
                    mr={2}
                  >
                    Name:
                  </Text>
                  {channel.name}
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: "inline", md: "none" }}
                    mr={2}
                  >
                    Status:
                  </Text>

                  {channel.isActive ? (
                    <Badge colorScheme="green">Active</Badge>
                  ) : (
                    <Badge colorScheme="red">Deactivated</Badge>
                  )}
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: "inline", md: "none" }}
                    mr={2}
                  >
                    No of Members:
                  </Text>
                  {channel.members.length}
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: "inline", md: "none" }}
                    mr={2}
                  >
                    Team:
                  </Text>
                  {channel.team["name"]}
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: "inline", md: "none" }}
                    mr={2}
                  >
                    Last Modified:
                  </Text>
                  {moment(channel.updatedAt).format("MMM DD, YYYY")}
                </Box>

                <Menu isLazy>
                  <MenuButton color="primary">
                    <Icon as={FaEllipsisH} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => ViewMembersHandler(channel._id)}>
                      View members
                    </MenuItem>

                    <MenuItem
                      color={channel.isActive === true ? "danger" : "success"}
                      onClick={() =>
                        ChangeStatusHandler(channel._id, channel.isActive)
                      }
                    >
                      {channel.isActive === true
                        ? "Deactivate channel"
                        : "Restore channel"}
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
