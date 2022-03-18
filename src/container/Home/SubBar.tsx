import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Menu,
  MenuButton,
  Text,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
  HStack,
  Icon,
  Flex,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import StyleContext from "../../context/StyleContext";
import { ITeamChannel } from "../../models/interface";
import { useChannelsOfTheUserQuery } from "../../app/features/member-query";
import StringTruncate from "../../utils/StringTruncate";
import { FaHashtag, FaPlus } from "react-icons/fa";
import { useTicketsNotSeenQuery } from "../../app/features/ticket-query";
import { Link, useParams } from "react-router-dom";

const SubBar: React.FC<{
  userId: string;
  isMobile: boolean;
}> = ({ userId, isMobile }) => {
  const { channelId } = useParams();
  const { borderLine, bgColor } = useContext(StyleContext);
  const [state, setState] = useState<ITeamChannel>();
  const { data, isLoading } = useChannelsOfTheUserQuery(userId);
  const { data: ticketsNotSeen, isLoading: loadingNotSeen } =
    useTicketsNotSeenQuery(userId);

  const onChangeTeam = (team: ITeamChannel) => {
    setState(team);
  };

  useEffect(() => {
    if (data !== undefined) {
      setState(data[0]);
    }
  }, [data]);

  return (
    <Flex
      borderRight="1px"
      borderColor={borderLine}
      w="19rem"
      height="full"
      flexDirection="column"
    >
      {/* TEAM */}
      <Box w="full" borderBottom="1px" borderColor={borderLine}>
        {isLoading ? (
          <Text p={3} fontSize="lg" color="accent">
            Loading...
          </Text>
        ) : (
          <Menu>
            <MenuButton p={3}>
              <Text fontSize={isMobile ? "xs" : "xl"}>
                {state && StringTruncate(state?.team)}
              </Text>
            </MenuButton>
            <MenuList>
              <MenuGroup title="Team Name">
                {data?.map((team) => (
                  <MenuItem key={team._id} onClick={() => onChangeTeam(team)}>
                    {team.team}
                  </MenuItem>
                ))}
              </MenuGroup>
              <MenuDivider />
              <MenuGroup>
                <MenuItem>Manage Teams</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        )}
      </Box>

      {state !== undefined ? (
        <Flex alignItems="flex-start" w="full" flexDirection="column">
          <HStack justifyContent="space-between" w="full" p={3}>
            <Text>Channels</Text>

            <Icon as={FaPlus} _hover={{ cursor: "pointer" }} />
          </HStack>

          {state.channels.map((channel) => (
            <Link to={channel._id} key={channel._id} className="sample">
              <HStack
                justifyContent="space-between"
                w="full"
                py={2}
                px={3}
                _hover={{
                  bg: channel._id === channelId ? "primary" : bgColor,
                  cursor: "pointer",
                }}
                bgColor={channel._id === channelId ? "primary" : "none"}
              >
                <HStack>
                  <Icon as={FaHashtag} />
                  <Text>{channel.name}</Text>
                </HStack>
                {loadingNotSeen ? (
                  <Spinner colorScheme="purple" size="sm" />
                ) : (
                  ticketsNotSeen &&
                  ticketsNotSeen.map(
                    (item) =>
                      item._id === channel._id && (
                        <Badge colorScheme="purple" key={item._id}>
                          {item.count}
                        </Badge>
                      )
                  )
                )}
              </HStack>
            </Link>
          ))}
        </Flex>
      ) : (
        <Text p={4} color="gray.500" fontSize="sm">
          no channels available
        </Text>
      )}
    </Flex>
  );
};

export default SubBar;
