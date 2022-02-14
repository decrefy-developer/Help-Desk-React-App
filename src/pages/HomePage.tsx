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
  Progress,
  VStack,
  Divider,
  Avatar,
  Badge,
  AvatarBadge,
  FormControl,
  FormErrorMessage,
  RadioGroup,
  Radio,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import {
  FaHashtag,
  FaEllipsisH,
  FaSearch,
  FaPlus,
  FaClock,
  FaUserPlus,
  FaTrashAlt,
} from "react-icons/fa";
import StyleContext from "../context/StyleContext";
import { useDispatch, useSelector } from "react-redux";
import { DecodeToken } from "../services/decode-token";
import { appDispatch, RootState } from "../app/store";
import { setUser } from "../features/user-slice";
import {
  useChannelsOfTheUserQuery,
  useListMemberQuery,
} from "../features/member-query";
import StringTruncate from "../utils/StringTruncate";
import Pagination from "@choc-ui/paginator";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IChannel, IFormInputTicket, ITeamChannel } from "../models/interface";
import { schemaAddMemberToChannel, schemaTicket } from "../models/schemas";
import SelectTeam from "./HomeComponents/SelectTeam";
import SelectChannel from "./HomeComponents/SelectChannel";
import SelectCustomer from "./HomeComponents/SelectCustomer";
import SelectCategory from "./HomeComponents/SelectCategory";
import TextAreaConcern from "./HomeComponents/TextAreaConcern";
import SelectCoworker from "./HomeComponents/SelectCoworker";
import SelectStartDate from "./HomeComponents/SelectStartDate";
import SelectTargetDate from "./HomeComponents/SelectTargetDate";
import {
  useAddTicketMutation,
  useListTicketsQuery,
} from "../features/ticket-query";
import { toast } from "react-toastify";
import ModalComponent from "../components/Modal";
import {
  useGetChannelQuery,
  useManageMembertoChannelMutation,
} from "../features/channel-query";
import SkeletonPlaceHolder from "../components/SkeletonPlaceHolder";
import { Select } from "chakra-react-select";
import PageContentScroll from "../components/PageContentScroll";
import useTableControl from "../hooks/useTableControl";

const SubBar: React.FC<{
  onOpen: () => void;
  userId: string;
  selectedChannel: string;
  setSelectedChannel: React.Dispatch<
    React.SetStateAction<{ channelId: string; channelName: string }>
  >;
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
              onClick={() =>
                setSelectedChannel({
                  channelId: channel._id,
                  channelName: channel.name,
                })
              }
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

const HeadingComponent: React.FC<{
  title: string;
  isMobile: boolean;
  openModal: () => void;
}> = ({ title, isMobile, openModal }) => {
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
        <Icon as={FaEllipsisH} cursor="pointer" onClick={openModal} />
      </HStack>
    </HStack>
  );
};

const ContentHeading = ({ screenPadding }: { screenPadding: number }) => {
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
          <Button leftIcon={<FaPlus />} bgColor="primary" w={["full", "100px"]}>
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
      </Stack>
    </Flex>
  );
};

const ContentMain = () => {
  const {
    data: tickets,
    isFetching,
    isLoading,
    isError,
  } = useListTicketsQuery({
    page: 1,
    limit: 10,
    search: "",
    status: true,
  });
  const bgColor = useColorModeValue("gray.400", "#011627");
  const { borderLine } = useContext(StyleContext);

  const { onChangePage, onChangeLimit, page, pageLimit } = useTableControl();

  console.log("data", tickets);

  return (
    <Flex w="full" px={8} flexDirection={{ base: "column", md: "row" }}>
      <Flex w={{ base: "100%", md: "45%" }} pr={5} direction="column">
        {isLoading ? (
          <Text color="gray.500">Pagination is loading...</Text>
        ) : (
          <Pagination
            size="xs"
            currentPage={page}
            total={tickets?.totalDocs}
            paginationProps={{
              display: "flex",
              justifyContent: "flex-end",
              mb: "9px",
            }}
            baseStyles={{ border: "1px" }}
            activeStyles={{ bg: "primary" }}
            onChange={(page) => onChangePage(page)}
            pageSize={pageLimit}
            showSizeChanger
            onShowSizeChange={(__, size) => {
              onChangeLimit(size);
              onChangePage(1);
            }}
          />
        )}

        <PageContentScroll maxH="500px" pr="10px">
          <Stack spacing={8}>
            {isFetching ? (
              <SkeletonPlaceHolder count={5} />
            ) : (
              tickets?.docs.map((ticket) => (
                <SimpleGrid
                  key={ticket._id}
                  border="1px"
                  w="full"
                  borderColor={borderLine}
                >
                  <HStack
                    w="full"
                    // borderBottom="1px"
                    // borderColor={borderLine}
                    borderStyle="dashed"
                    p={2}
                  >
                    <Flex alignItems="center">
                      <Text
                        mx={2}
                        fontSize="sm"
                        fontWeight="light"
                        color="gray.500"
                      >
                        {ticket.user.email}
                      </Text>
                    </Flex>
                  </HStack>

                  <HStack p={2}>
                    <Stack p={2}>
                      <Text fontSize="20px">{`# ${ticket.ticketNumber}`}</Text>
                    </Stack>
                    <Flex direction="column">
                      <Text fontWeight="bold" color="accent">
                        {ticket.customer.name}
                      </Text>
                      <Text fontWeight="light" fontSize="sm" color="gray.500">
                        {`Category: ${ticket.category.name}`}
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
                    <HStack color="gray.500">
                      <Icon as={FaClock} />
                      <Tooltip label="2 days left">
                        <Text fontSize="xs" fontWeight="light">
                          {ticket.targetDate}
                        </Text>
                      </Tooltip>
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
              ))
            )}
          </Stack>
        </PageContentScroll>
      </Flex>

      <Flex w={{ base: "100%", md: "55%" }} bgColor={bgColor}></Flex>
    </Flex>
  );
};

const ModalMembers: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
}> = ({ isOpen, onClose, channelId }) => {
  const {
    data: channel,
    isLoading,
    isError,
    refetch,
  } = useGetChannelQuery(channelId);
  const { data: listMembers, isFetching: isMembersFetching } =
    useListMemberQuery({
      page: 1,
      limit: 100,
      search: "",
      status: true,
    });

  const [ManageMembertoChannel] = useManageMembertoChannelMutation();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaAddMemberToChannel),
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      //  TODO: transform the data into API requirement
      const newMember = {
        _id: channelId,
        mode: "ADD",
        data: {
          userId: data.member["value"],
          email: data.member["label"],
          isAdmin: data.isAdmin,
        },
      };
      const result = await ManageMembertoChannel(newMember).unwrap();
      if (result) {
        toast.success(`${data.member["label"]} successfully added as member`);
        refetch();
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  const removeMemberHandler = async (data: any) => {
    try {
      const member = {
        _id: channelId,
        mode: "REMOVE",
        data: {
          userId: data.userId,
          email: data.email,
          isAdmin: data.isAdmin,
        },
      };
      const result = await ManageMembertoChannel(member).unwrap();
      if (result) {
        toast.success(`${data.email} successfully removed as member`);
        refetch();
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  useEffect(() => {
    if (isError)
      return alert("An error has occured!, please reafresh the page ");
  }, [isError]);

  return (
    <ModalComponent
      title={`# Members (${channel?.members.length} participants)`}
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <Box mb={5}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <FormControl isInvalid={errors?.member ? true : false}>
              <Controller
                control={control}
                name="member"
                render={({ field }) => (
                  <Select
                    {...field}
                    isLoading={isMembersFetching}
                    selectedOptionStyle="color"
                    placeholder="Select a member"
                    options={listMembers?.docs.map(function (member) {
                      return { value: member._id, label: member.email };
                    })}
                    selectedOptionColor="purple"
                    isClearable={true}
                  />
                )}
              />
              <FormErrorMessage>
                {errors?.member && "Member is required"}
              </FormErrorMessage>
            </FormControl>

            <HStack justifyContent="space-between">
              <FormControl isInvalid={errors?.isAdmin ? true : false}>
                <Controller
                  control={control}
                  name="isAdmin"
                  render={({ field }) => (
                    <RadioGroup onChange={(e) => field.onChange(e)}>
                      <Stack spacing={5} direction="row" pl={2}>
                        <Radio colorScheme="yellow" value="0">
                          Standard
                        </Radio>
                        <Radio colorScheme="green" value="1">
                          Admin
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  )}
                />
                <FormErrorMessage>{errors?.isAdmin?.message}</FormErrorMessage>
              </FormControl>

              <Button size="sm" type="submit" disabled={!isValid}>
                Add
              </Button>
            </HStack>
            <Divider />
          </Stack>
        </form>

        <InputGroup my={5}>
          <InputLeftElement
            zIndex="0"
            pointerEvents="none"
            children={<FaSearch color="gray.300" />}
          />
          <Input
            type="text"
            placeholder="Find member"
            variant="filled"
            onChange={(e) => console.log(e.target.value)}
          />
        </InputGroup>

        {isLoading ? (
          <Box mb={5}>
            <Progress size="xs" isIndeterminate colorScheme="purple" />
            <Text fontWeight="light" color="gray.500">
              please wait...
            </Text>
          </Box>
        ) : (
          <Table size="sm" my={4}>
            <Thead>
              <Tr>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {channel?.members.map((item) => (
                <Tr key={item._id}>
                  <Td>{item.email}</Td>
                  <Td>
                    {item.isAdmin ? (
                      <Badge colorScheme="green">Admin</Badge>
                    ) : (
                      <Badge colorScheme="yellow">Standard</Badge>
                    )}
                  </Td>
                  <Td>
                    <HStack>
                      <Tooltip label="remove member">
                        <Button
                          size="xs"
                          onClick={() => removeMemberHandler(item)}
                        >
                          <Icon as={FaTrashAlt} cursor="pointer" />
                        </Button>
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </ModalComponent>
  );
};

const HomePage: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedChannel, setSelectedChannel] = useState<{
    channelId: string;
    channelName: string;
  }>({ channelId: "", channelName: "" });
  const dispatch = useDispatch<appDispatch>();
  const [screenPadding, setScreenPadding] = useState<number>(4);
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const {
    isOpen: isMemberModalOpen,
    onOpen: openMemberModal,
    onClose: closeModalMember,
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
      {user._id !== "" && (
        <SubBar
          isMobile={isMobile}
          onOpen={onOpen}
          userId={user._id}
          selectedChannel={selectedChannel?.channelName}
          setSelectedChannel={setSelectedChannel}
        />
      )}
      <Flex w="full">
        <Flex w="full" flexDirection="column">
          {selectedChannel.channelName !== "" && (
            <>
              <HeadingComponent
                title={selectedChannel.channelName}
                isMobile={isMobile}
                openModal={openMemberModal}
              />

              <ContentHeading screenPadding={screenPadding} />

              <ContentMain />
            </>
          )}
        </Flex>

        {isMemberModalOpen && (
          <ModalMembers
            isOpen={isMemberModalOpen}
            onClose={closeModalMember}
            channelId={selectedChannel.channelId}
          />
        )}

        {/* <Flex w="20rem" bgColor="gray.700">
          e
        </Flex> */}
      </Flex>
    </React.Fragment>
  );
};

export default HomePage;
