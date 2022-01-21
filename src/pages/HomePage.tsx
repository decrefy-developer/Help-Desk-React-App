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
} from "@chakra-ui/react";
import { FaPlus, FaHashtag } from "react-icons/fa";
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

const ChannelItem = ({ name }: { name: string }) => {
  const { bgColor } = useContext(StyleContext);
  return (
    <HStack
      w="full"
      alignItems="center"
      pl={5}
      _hover={{ bg: bgColor, cursor: "pointer" }}
    >
      <Icon as={FaHashtag} />
      <Text>{name}</Text>
    </HStack>
  );
};

const SubBar: React.FC<{ onOpen: () => void; userId: string }> = ({
  onOpen,
  userId,
}) => {
  const { borderLine } = useContext(StyleContext);
  const [state, setState] = useState<ITeamChannel>();
  const { data, isLoading } = useChannelsOfTheUserQuery(userId);

  const onChangeTeam = (team: ITeamChannel) => {
    setState(team);
  };

  useEffect(() => {
    if (data !== undefined) {
      setState(data[0]);
    }
  }, [data]);

  return (
    <VStack borderRight="1px" borderColor={borderLine} w="15rem" height="full">
      {/* TEAM */}
      <Box w="full" borderBottom="1px" borderColor={borderLine}>
        {isLoading ? (
          <Text p={3} fontSize="lg" color="accent">
            Loading...
          </Text>
        ) : (
          <Menu>
            <MenuButton size="md" p={3}>
              <Text fontSize="xl">{state && StringTruncate(state?.team)}</Text>
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
                <MenuItem>Sign out of 'Team Name'</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        )}
      </Box>

      {/* CHANNEL */}
      {state !== undefined ? (
        <VStack alignItems="flex-start" w="full">
          <HStack justifyContent="space-between" w="full" px={3}>
            <Text>Channels</Text>

            <Popover placement="bottom-start" preventOverflow>
              <PopoverTrigger>
                <Box aria-label="Some box">
                  <Icon as={FaPlus} _hover={{ cursor: "pointer" }} />
                </Box>
              </PopoverTrigger>
              <PopoverContent w="12rem">
                <PopoverArrow bg="purple.500" />
                <PopoverBody>
                  <Text _hover={{ cursor: "pointer", color: "purple.300" }}>
                    Browse channel
                  </Text>
                  <Text
                    onClick={onOpen}
                    _hover={{ cursor: "pointer", color: "purple.300" }}
                  >
                    Create a channel
                  </Text>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </HStack>

          {state.channels.map((channel) => (
            <ChannelItem key={channel._id} name={channel.name} />
          ))}
        </VStack>
      ) : (
        <Text p={4} color="gray.500" fontSize="sm">
          no channels available
        </Text>
      )}
    </VStack>
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

const HomePage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch<appDispatch>();

  const user = useSelector((state: RootState) => state.userSlice);

  useEffect(() => {
    const decoded: any = DecodeToken();
    if (decoded) {
      dispatch(setUser(decoded));
    }
  }, [dispatch]);

  return (
    <React.Fragment>
      {user._id !== "" && <SubBar onOpen={onOpen} userId={user._id} />}
      <Flex w="full" flexDirection="column">
        <Heading title="Home" />
      </Flex>
    </React.Fragment>
  );
};

export default HomePage;
