import React, { useContext, useEffect, useState } from "react";
import {
  VStack,
  Box,
  Menu,
  MenuButton,
  Text,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
  HStack,
  Popover,
  PopoverTrigger,
  Icon,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  useDisclosure,
  Stack,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Input,
  FormHelperText,
  Button,
  Flex,
  useMediaQuery,
} from "@chakra-ui/react";
import { FaPlus, FaHashtag, FaEllipsisH } from "react-icons/fa";
import StyleContext from "../context/StyleContext";
import ModalComponent from "../components/Modal";
import Heading from "../components/Heading";
import { useDispatch, useSelector } from "react-redux";
import { DecodeToken } from "../services/decode-token";
import { appDispatch, RootState } from "../app/store";
import { setUser } from "../features/user-slice";
import { useChannelsOfTheUserQuery } from "../features/member-query";
import { ITeamChannel } from "../features/data-types";
import StringTruncate from "../utils/StringTruncate";

const SubBar: React.FC<{
  onOpen: () => void;
  userId: string;
  selectedChannel: string;
  setSelectedChannel: React.Dispatch<React.SetStateAction<string>>;
  isMobile: boolean;
}> = ({ onOpen, userId, selectedChannel, setSelectedChannel, isMobile }) => {
  const { borderLine } = useContext(StyleContext);
  const [state, setState] = useState<ITeamChannel>();
  const { data, isLoading } = useChannelsOfTheUserQuery(userId);
  const { bgColor } = useContext(StyleContext);

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
      w="15rem"
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
            <MenuButton size="md" p={3}>
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

      {/* CHANNEL */}
      {state !== undefined ? (
        <Flex alignItems="flex-start" w="full" flexDirection="column">
          <HStack justifyContent="space-between" w="full" p={3}>
            <Text>Channels</Text>

            <Icon as={FaPlus} _hover={{ cursor: "pointer" }} />
          </HStack>

          {state.channels.map((channel) => (
            <Flex
              key={channel._id}
              w="full"
              pl={3}
              pt={2}
              pb={2}
              alignItems="center"
              _hover={{
                bg: channel.name === selectedChannel ? "primary" : bgColor,
                cursor: "pointer",
              }}
              bgColor={channel.name === selectedChannel ? "primary" : "none"}
              onClick={() => setSelectedChannel(channel.name)}
            >
              <Icon as={FaHashtag} />
              <Text>{channel.name}</Text>
            </Flex>
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

// const ModalNewChannel = () => {
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//   };
//   <ModalComponent title="Create a channel" isOpen={isOpen} onClose={onClose}>
//     <Stack spacing={5} p={3}>
//       <form onSubmit={handleSubmit}>
//         <Text fontSize="sm">
//           Channels are where your team communicates. They’re best when organized
//           around a topic — #marketing, for example.
//         </Text>

//         <FormControl>
//           <FormLabel>Name</FormLabel>
//           <InputGroup>
//             <InputLeftElement pointerEvents="none" children={<FaHashtag />} />
//             <Input
//               variant="outline"
//               placeholder="support-service"
//               name="name"
//               onChange={handleChange}
//             />
//           </InputGroup>
//         </FormControl>

//         <FormControl>
//           <FormLabel>Description (optional)</FormLabel>
//           <Input variant="outline" name="description" onChange={handleChange} />
//           <FormHelperText>What this channel-group about?</FormHelperText>
//         </FormControl>

//         <Button type="submit" variant="solid" w="5rem" size="sm">
//           Create
//         </Button>
//       </form>
//     </Stack>
//   </ModalComponent>;
// };

const HeadingComponent = ({
  title,
  isMobile,
}: {
  title: string;
  isMobile: boolean;
}) => {
  const { borderLine } = useContext(StyleContext);
  return (
    <HStack
      borderBottom="1px"
      borderColor={borderLine}
      p={3}
      justifyContent="space-between"
    >
      <HStack>
        <Icon as={FaHashtag} />
        <Text fontSize={isMobile ? "xs" : "xl"} fontWeight="light">
          {title !== "" ? `${title}` : "Please select channel"}
        </Text>
      </HStack>

      <HStack>
        <Icon as={FaEllipsisH} cursor="pointer" />
      </HStack>
    </HStack>
  );
};

const HomePage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const dispatch = useDispatch<appDispatch>();
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const user = useSelector((state: RootState) => state.userSlice);

  useEffect(() => {
    const decoded: any = DecodeToken();
    if (decoded) {
      dispatch(setUser(decoded));
    }
  }, [dispatch]);

  return (
    <React.Fragment>
      {user._id !== "" && (
        <SubBar
          isMobile={isMobile}
          onOpen={onOpen}
          userId={user._id}
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
        />
      )}
      <Flex w="full" flexDirection="column">
        <HeadingComponent title={selectedChannel} isMobile={isMobile} />
      </Flex>
    </React.Fragment>
  );
};

export default HomePage;
