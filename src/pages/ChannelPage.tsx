import {
  Badge,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  HStack,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import Pagination from "@choc-ui/paginator";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaCaretDown,
  FaEllipsisH,
} from "react-icons/fa";
import HeadingComponent from "../components/Heading";
import SubHeadingComponent from "../components/SubHeading";
import Dialog from "../components/AlertDialog";
import {
  useAddChannelMutation,
  useChangeStatusMutation,
  useListChannelQuery,
} from "../features/channel-query";
import { toast } from "react-toastify";
import ModalComponent from "../components/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useListTeamQuery } from "../features/team-query";
import PageContentScroll from "../components/PageContentScroll";
import { IChannel, ListResponse } from "../models/interface";
import { schemaChannel } from "../models/schemas";

const DrawerComponent = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [page, setPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const [addChannel, { isLoading }] = useAddChannelMutation();
  const { data, isError, isFetching } = useListTeamQuery({
    page: page,
    limit: 10,
    search: searchText,
    status: true,
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<{ teamId: string; name: string }>({
    mode: "onChange",
    resolver: yupResolver(schemaChannel),
  });

  const nextPageHandler = () => {
    const nextPage = data?.nextPage;
    setPage(Number(nextPage));
  };

  const previewPageHandler = () => {
    const prevPage = data?.prevPage;
    setPage(Number(prevPage));
  };

  const onSubmit = async (data: { name: string }) => {
    try {
      const result = await addChannel(data).unwrap();

      if (result) {
        onClose();
        reset();
        toast.success(`${result.name}  was successfully added.`);
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  useEffect(() => {
    if (isError)
      return alert("An error has occurred!, please refresh the page");
  }, [isError]);

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <DrawerOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Create a new channel
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Input
                    variant="unstyled"
                    placeholder="search team here.."
                    fontSize="sm"
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <HStack>
                    <Button
                      variant="ghost"
                      size="xs"
                      disabled={!data?.hasPrevPage}
                      onClick={previewPageHandler}
                    >
                      <Icon as={FaAngleLeft} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="xs"
                      disabled={!data?.hasNextPage}
                      onClick={nextPageHandler}
                    >
                      <Icon as={FaAngleRight} />
                    </Button>
                  </HStack>
                </Box>
                <Select
                  icon={
                    isFetching ? (
                      <CircularProgress
                        isIndeterminate
                        color="primary"
                        size="20px"
                      />
                    ) : (
                      <FaCaretDown />
                    )
                  }
                  placeholder="Select Team"
                  id="team"
                  {...register("teamId")}
                >
                  {data?.docs.map((team) => (
                    <option value={team._id} key={team._id}>
                      {team.name}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box>
                <FormLabel htmlFor="channel" fontSize="sm" color="gray.400">
                  Channel Name
                </FormLabel>
                <Input
                  autoComplete="off"
                  id="channel"
                  placeholder="Please enter name"
                  {...register("name")}
                />
                <Text textAlign="left" fontSize="xs" p={1} color="danger">
                  {errors.name?.message}
                </Text>
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={!isDirty || !isValid}
              colorScheme="blue"
              type="submit"
              isLoading={isLoading}
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

const TableComponent = ({
  data,
  padding,
  rowId,
  ChangeStatusHandler,
  ViewMembersHandler,
}: {
  data: ListResponse<IChannel> | undefined;
  padding: number;
  rowId: string;
  ChangeStatusHandler: (_id: string, isActive: boolean) => void;
  ViewMembersHandler: (_id: string) => void;
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

const ModalComponentViewMembers = ({
  data,
  userId,
  isOpen,
  onClosed,
}: {
  data: Array<IChannel>;
  userId: string;
  isOpen: boolean;
  onClosed: () => void;
}) => {
  const [members, setMembers] = useState<IChannel>();

  useEffect(() => {
    let selectedMember = data.filter(({ _id }) => _id === userId);

    setMembers(selectedMember[0]);
  }, [data, userId]);

  return (
    <ModalComponent
      title="Members"
      isOpen={isOpen}
      onClose={onClosed}
      size="sm"
      isCentered={false}
    >
      <Table borderColor="white" size="sm">
        <Thead>
          <Tr>
            <Th>email</Th>
            <Th>Role</Th>
          </Tr>
        </Thead>
        <Tbody>
          {members?.members.map((item) => (
            <Tr key={item._id}>
              <Td>{item.email}</Td>
              <Td>
                {item.isAdmin ? (
                  <Badge colorScheme="green">Admin</Badge>
                ) : (
                  <Badge colorScheme="yellow">Standard</Badge>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </ModalComponent>
  );
};

const ChannelPage = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [screenPadding, setScreenPadding] = useState<number>(4);
  const [rowId, setRowId] = useState<string>(""); // use for highlight the row of the table
  const [isArchieve, setIsArchieve] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false); // holds the user account status before submitting

  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();
  const {
    isOpen: isDialogChangeStatuOpen,
    onOpen: openDialogChangeStatus,
    onClose: closeDialogChangeStatus,
  } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const { data, isError, isLoading, isFetching } = useListChannelQuery({
    page,
    limit,
    search,
    status: !isArchieve,
  });
  const [changeStatus] = useChangeStatusMutation();

  const onChangePageHandler = (pageNumber: any) => {
    setPage(Number(pageNumber));
  };

  const onChangeLimitHandler = (limitNumber: any) => {
    setLimit(Number(limitNumber));
    // refetch();
  };

  const ChangeStatusHandler = useCallback(
    (_id: string, isActive: boolean) => {
      setRowId(_id);
      setIsActive(!isActive);
      openDialogChangeStatus();
    },
    [openDialogChangeStatus]
  );

  const ViewMembersHandler = useCallback(
    (_id: string) => {
      setRowId(_id);
      openModal();
    },
    [openModal]
  );

  const changeStatusSubmit = useCallback(async () => {
    try {
      const result = await changeStatus({
        _id: rowId,
        isActive: isActive,
      }).unwrap();

      if (result) {
        closeDialogChangeStatus();
        toast.success(
          `${result.name} was ${isActive ? "actived" : "deactivated"}`
        );
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  }, [closeDialogChangeStatus, isActive, rowId, changeStatus]);

  useEffect(() => {
    if (isError)
      return alert("An error has occured!, please reafresh the page ");
  }, [isError]);

  useEffect(() => {
    if (isMobile === false) {
      setScreenPadding(20);
    } else {
      setScreenPadding(4);
    }
  }, [isMobile]);

  return (
    <React.Fragment>
      <Flex w="full" flexDirection="column">
        <HeadingComponent title="Manage Channels" />

        <SubHeadingComponent
          title="Channels list"
          onOpen={openDrawer}
          setSearch={setSearch}
          padding={screenPadding}
          placeHolder="Seach name"
        />

        <PageContentScroll>
          <Flex
            py={8}
            px={screenPadding}
            justifyContent="space-between"
            alignItems="center"
            direction={isMobile ? "column" : "row"}
          >
            {isLoading ? (
              <Text color="gray.500">Pagination is loading...</Text>
            ) : (
              <HStack>
                <Pagination
                  currentPage={page}
                  total={data?.totalDocs}
                  paginationProps={{ display: "flex" }}
                  baseStyles={{ border: "1px" }}
                  activeStyles={{ bg: "primary" }}
                  onChange={(page) => onChangePageHandler(page)}
                  pageSize={limit}
                  showSizeChanger
                  onShowSizeChange={(__, size) => {
                    onChangeLimitHandler(size);
                    onChangePageHandler(1);
                  }}
                />
                <Text fontSize="sm" color="gray.500">
                  Items: {data?.totalDocs}
                </Text>
              </HStack>
            )}

            <HStack alignContent="center">
              {isFetching && (
                <CircularProgress isIndeterminate color="primary" size="30px" />
              )}

              <Checkbox onChange={(e) => setIsArchieve(e.target.checked)}>
                <Text fontSize="sm" color="gray.500">
                  show archived
                </Text>
              </Checkbox>
            </HStack>
          </Flex>

          {isLoading ? (
            <Stack w="full" py={10} px="20">
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          ) : (
            <TableComponent
              data={data}
              rowId={rowId}
              padding={screenPadding}
              ChangeStatusHandler={ChangeStatusHandler}
              ViewMembersHandler={ViewMembersHandler}
            />
          )}
        </PageContentScroll>
      </Flex>

      {isDialogChangeStatuOpen && (
        <Dialog
          title="Changing status"
          isOpen={isDialogChangeStatuOpen}
          onClose={closeDialogChangeStatus}
          onSubmit={changeStatusSubmit}
          children={
            <Text>
              Do you want to
              <i style={{ color: "#d65db1" }}>
                {isActive ? " activate " : " deactive "}
              </i>
              this channel?
            </Text>
          }
        />
      )}

      {isModalOpen && (
        <ModalComponentViewMembers
          userId={rowId}
          onClosed={closeModal}
          isOpen={isModalOpen}
          data={data !== undefined ? data?.docs : []}
        />
      )}

      {isDrawerOpen && (
        <DrawerComponent isOpen={isDrawerOpen} onClose={closeDrawer} />
      )}
    </React.Fragment>
  );
};

export default ChannelPage;
