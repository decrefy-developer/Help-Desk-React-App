import React, { useContext, useEffect } from "react";
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
import { appDispatch } from "../app/store";
import { setUser } from "../features/user-slice";

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

const SubBar: React.FC = () => {
  const { borderLine } = useContext(StyleContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch<appDispatch>();

  useEffect(() => {
    const decoded: any = DecodeToken();
    if (decoded) {
      dispatch(setUser(decoded));
    }
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const channels = [
    {
      _id: "1",
      name: "systemdev",
    },
    {
      _id: "2",
      name: "que-squad",
    },
    {
      _id: "3",
      name: "fisto-squad",
    },
  ];

  return (
    <VStack borderRight="1px" borderColor={borderLine} w="15rem" height="full">
      <Box w="full" borderBottom="1px" borderColor={borderLine}>
        <Menu>
          <MenuButton size="md" p={3}>
            <Text fontSize="xl">TEAMS</Text>
          </MenuButton>
          <MenuList>
            <MenuGroup title="Team Name">
              <MenuItem>Manage Teams</MenuItem>
              <MenuItem>Invite people in 'Team Name'</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuGroup>
              <MenuItem>Sign out of 'Team Name'</MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Box>
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

        {channels.map((channel) => (
          <ChannelItem key={channel._id} name={channel.name} />
        ))}
      </VStack>
      <ModalComponent
        title="Create a channel"
        isOpen={isOpen}
        onClose={onClose}
      >
        <Stack spacing={5} p={3}>
          <form onSubmit={handleSubmit}>
            <Text fontSize="sm">
              Channels are where your team communicates. They’re best when
              organized around a topic — #marketing, for example.
            </Text>

            <FormControl>
              <FormLabel>Name</FormLabel>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<FaHashtag />}
                />
                <Input
                  variant="outline"
                  placeholder="support-service"
                  name="name"
                  onChange={handleChange}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Description (optional)</FormLabel>
              <Input
                variant="outline"
                name="description"
                onChange={handleChange}
              />
              <FormHelperText>What this channel-group about?</FormHelperText>
            </FormControl>

            <Button type="submit" variant="solid" w="5rem" size="sm">
              Create
            </Button>
          </form>
        </Stack>
      </ModalComponent>
    </VStack>
  );
};

const HomePage: React.FC = () => {
  return (
    <React.Fragment>
      <SubBar />
      <Flex w="full" flexDirection="column">
        <Heading title="Home" />
      </Flex>
    </React.Fragment>
  );
};

export default HomePage;
