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
  useDisclosure,
  Flex,
  useMediaQuery,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Checkbox,
  useColorModeValue,
  SimpleGrid,
  Circle,
  Tooltip,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@chakra-ui/react";
import {
  FaHashtag,
  FaEllipsisH,
  FaSearch,
  FaPlus,
  FaClock,
} from "react-icons/fa";
import StyleContext from "../context/StyleContext";
import { useDispatch, useSelector } from "react-redux";
import { DecodeToken } from "../services/decode-token";
import { appDispatch, RootState } from "../app/store";
import { setUser } from "../features/user-slice";
import { useChannelsOfTheUserQuery } from "../features/member-query";
import StringTruncate from "../utils/StringTruncate";
import Pagination from "@choc-ui/paginator";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IChannel, IFormInputTicket, ITeamChannel } from "../models/interface";
import { schemaTicket } from "../models/schemas";
import SelectTeam from "./HomeComponents/SelectTeam";
import SelectChannel from "./HomeComponents/SelectChannel";
import SelectCustomer from "./HomeComponents/SelectCustomer";
import SelectCategory from "./HomeComponents/SelectCategory";
import TextAreaConcern from "./HomeComponents/TextAreaConcern";
import SelectCoworker from "./HomeComponents/SelectCoworker";
import SelectStartDate from "./HomeComponents/SelectStartDate";
import SelectTargetDate from "./HomeComponents/SelectTargetDate";
import { useAddTicketMutation } from "../features/ticket-query";
import { toast } from "react-toastify";

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
            <HStack
              key={channel._id}
              w="full"
              pl={3}
              pt={2}
              pb={2}
              _hover={{
                bg: channel.name === selectedChannel ? "primary" : bgColor,
                cursor: "pointer",
              }}
              bgColor={channel.name === selectedChannel ? "primary" : "none"}
              onClick={() => setSelectedChannel(channel.name)}
            >
              <Icon as={FaHashtag} />
              <Text>{channel.name}</Text>
            </HStack>
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
        <Text fontSize="xs" color="accent">
          (14 Participants)
        </Text>
      </HStack>

      <HStack>
        <Icon as={FaEllipsisH} cursor="pointer" />
      </HStack>
    </HStack>
  );
};

const ContentHeading = ({
  screenPadding,
  openDrawer,
}: {
  screenPadding: number;
  openDrawer: () => void;
}) => {
  return (
    <Flex w="full" flexDirection="column" padding={screenPadding}>
      <Stack direction={["column", "row"]}>
        <HStack w="full">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<FaSearch color="gray.300" />}
            />
            <Input
              type="text"
              placeholder="search"
              variant="filled"
              onChange={(e) => console.log(e.target.value)}
            />
          </InputGroup>
          <Button
            leftIcon={<FaPlus />}
            bgColor="primary"
            w={["full", "100px"]}
            onClick={openDrawer}
          >
            New
          </Button>
        </HStack>
      </Stack>

      <Stack
        direction={["column", "row"]}
        justifyContent="space-between"
        mt={5}
        alignItems="center"
      >
        <Stack>
          <Stack direction="row" spacing={3}>
            <Text fontSize="sm" color="accent">
              State:
            </Text>
            <Checkbox size="sm">Done</Checkbox>
            <Checkbox size="sm">Pending</Checkbox>
          </Stack>

          <Stack direction="row" spacing={3}>
            <Text fontSize="sm" color="accent">
              Status:
            </Text>
            <Checkbox size="sm">Open</Checkbox>
            <Checkbox size="sm">Closed</Checkbox>
            <Checkbox size="sm">Cancelled</Checkbox>
          </Stack>
        </Stack>

        <Pagination
          currentPage={1}
          total={10}
          paginationProps={{ display: "flex" }}
          baseStyles={{ border: "1px" }}
          activeStyles={{ bg: "primary" }}
          // onChange={(page) => onChangePageHandler(page)}
          pageSize={10}
          showSizeChanger
          // onShowSizeChange={(__, size) => {
          //   onChangeLimitHandler(size);
          //   onChangePageHandler(1);
          // }}
        />
      </Stack>
    </Flex>
  );
};

const DrawerComponent = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [channels, setChannel] = useState<
    Array<Pick<IChannel, "name" | "_id" | "isActive">>
  >([]);

  const { _id } = useSelector((state: RootState) => state.userSlice);
  const [addTicket] = useAddTicketMutation();

  const {
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaTicket),
  });

  const watchAllFields = watch();
  console.log(watchAllFields);

  const onSubmit: SubmitHandler<IFormInputTicket> = async (data) => {
    try {
      data.state = "PENDING";
      data.status = "OPEN";
      data.userId = "616677155d19f646703aa82b";
      data.createdBy = _id;

      const newTicket = await addTicket(data).unwrap();

      if (newTicket) {
        console.log("submitted", newTicket);
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      closeOnOverlayClick={false}
      size="xl"
    >
      <DrawerOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">New Ticket</DrawerHeader>

          <DrawerBody>
            <Stack direction={{ base: "column", md: "row" }} mt={5}>
              <Stack spacing="24px" w="full" p={4} borderWidth="1px">
                <Text color="success">Concern Details</Text>

                <SelectCustomer control={control} errors={errors} />

                <SelectCategory control={control} errors={errors} />
                <TextAreaConcern control={control} errors={errors} />
              </Stack>

              <Stack spacing="24px" w="full" p={4} borderWidth="1px">
                <Text color="success">Set Ticket Details</Text>
                <SelectTeam
                  control={control}
                  errors={errors}
                  getValues={getValues}
                  setChannel={setChannel}
                />
                <SelectChannel
                  channels={channels}
                  control={control}
                  errors={errors}
                />

                <SelectCoworker
                  control={control}
                  getValues={getValues}
                  watch={watch}
                />

                <SelectStartDate control={control} errors={errors} />
                <SelectTargetDate control={control} errors={errors} />
              </Stack>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button bgColor="primary" type="submit" disabled={!isValid}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

const ContentMain = () => {
  const bgColor = useColorModeValue("gray.400", "gray.700");
  const { borderLine } = useContext(StyleContext);

  return (
    <Flex w="full" padding={8} flexDirection="row">
      <Stack w="40%" pr={5} spacing={8}>
        <SimpleGrid border="1px" w="full" borderColor={borderLine}>
          <HStack
            w="full"
            borderBottom="1px"
            borderColor={borderLine}
            borderStyle="dashed"
            p={2}
          >
            <Flex alignItems="center">
              <Tooltip label="2 days left">
                <Circle size="15px" bg="success" />
              </Tooltip>
              <Text mx={2} fontSize="sm" fontWeight="light">
                erwin@gmail.com
              </Text>
            </Flex>
          </HStack>

          <HStack p={2}>
            <Stack p={2}>
              <Text fontSize="20px"># 1446</Text>
            </Stack>
            <Flex direction="column">
              <Text fontWeight="bold" color="accent">
                Central Depot
              </Text>
              <Text fontWeight="light" fontSize="sm">
                Category: Hardware Failure
              </Text>
            </Flex>
          </HStack>

          <HStack
            borderTop="1px"
            borderColor={borderLine}
            borderStyle="dashed"
            p={2}
            justifyContent="space-between"
          >
            <HStack>
              <Icon as={FaClock} />
              <Text fontSize="xs" fontWeight="light" color="gray.500">
                Feb 28 10:05 AM
              </Text>
            </HStack>

            <HStack>
              <Text
                fontSize="xs"
                fontWeight="light"
                color="primary"
                cursor="pointer"
              >
                View Details
              </Text>
            </HStack>
          </HStack>
        </SimpleGrid>
      </Stack>

      <Flex w="60%" bgColor="gray.700">
        2
      </Flex>
    </Flex>
  );
};

const ContentRighBar = () => {};

const HomePage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const dispatch = useDispatch<appDispatch>();
  const [screenPadding, setScreenPadding] = useState<number>(4);
  const [isMobile] = useMediaQuery("(max-width: 600px)");
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();

  const user = useSelector((state: RootState) => state.userSlice);

  useEffect(() => {
    const decoded: any = DecodeToken();
    if (decoded) {
      dispatch(setUser(decoded));
    }
  }, [dispatch]);

  useEffect(() => {
    if (isMobile === false) {
      setScreenPadding(10);
    } else {
      setScreenPadding(4);
    }
  }, [isMobile]);

  return (
    <React.Fragment>
      <DrawerComponent isOpen={isDrawerOpen} onClose={closeDrawer} />
      {user._id !== "" && (
        <SubBar
          isMobile={isMobile}
          onOpen={onOpen}
          userId={user._id}
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
        />
      )}
      <Flex w="full">
        <Flex w="full" flexDirection="column">
          <HeadingComponent title={selectedChannel} isMobile={isMobile} />

          <ContentHeading
            screenPadding={screenPadding}
            openDrawer={openDrawer}
          />

          <ContentMain />
        </Flex>

        {/* <Flex w="20rem" bgColor="gray.700">
          e
        </Flex> */}
      </Flex>
    </React.Fragment>
  );
};

export default HomePage;
