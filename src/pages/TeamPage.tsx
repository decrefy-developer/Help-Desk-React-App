import {
  Avatar,
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
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSearch, FaEllipsisH } from "react-icons/fa";
import { toast } from "react-toastify";
import HeadingComponent from "../components/Heading";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ITeam,
  useAddTeamMutation,
  useListTeamQuery,
  useChangeStatusMutation,
} from "../features/team-query";
import { ListResponse } from "../features/data-types";
import moment from "moment";
import Pagination from "@choc-ui/paginator";
import ModalComponent from "../components/Modal";
import Dialog from "../components/AlertDialog";
import SubHeadingComponent from "../components/SubHeading";
import PageContentScroll from "../components/PageContentScroll";

const schema = yup.object().shape({
  name: yup.string().required("Team name is required").min(5),
});

const DrawerComponent = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [addTeam] = useAddTeamMutation();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<{ name: string }>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { name: string }) => {
    try {
      const result = await addTeam(data).unwrap();

      if (result) {
        onClose();
        reset();
        toast.success(`${result.name}  was successfully added.`);
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
    >
      <DrawerOverlay />
      <DrawerContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Create a new team</DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="email">Team Name</FormLabel>
                <Input
                  autoComplete="off"
                  id="name"
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
              // isLoading={isLoading}
            >
              Submit
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

const TableComponent = ({
  data,
  padding,
  rowId,
  ViewChannelsHandler,
  ChangeStatusHandler,
}: {
  data: ListResponse<ITeam> | undefined;
  padding: number;
  rowId: string;
  ViewChannelsHandler: (_id: string) => void;
  ChangeStatusHandler: (_id: string, isActive: boolean) => void;
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
            Name
          </Text>
          <Text color="accent" fontWeight="normal">
            Status
          </Text>
          <Text color="accent" fontWeight="normal">
            Number of Channels
          </Text>
          <Text color="accent" fontWeight="normal">
            Last Modified
          </Text>
          <Text></Text>
        </SimpleGrid>
        {data?.docs.map((team) => {
          return (
            <Flex direction={{ base: "row", md: "column" }} key={team._id}>
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
                bgColor={rowId === team._id ? "gray.700" : "none"}
              >
                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: "inline", md: "none" }}
                    mr={2}
                  >
                    Name:
                  </Text>
                  {team.name}
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: "inline", md: "none" }}
                    mr={2}
                  >
                    Status:
                  </Text>

                  {team.isActive ? (
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
                    No of channels:
                  </Text>
                  {team.numberOfChannels}
                </Box>

                <Box {...styleAsTd}>
                  <Text
                    color="accent"
                    display={{ base: "inline", md: "none" }}
                    mr={2}
                  >
                    Last Modified:
                  </Text>
                  {moment(team.updatedAt).format("MMM DD, YYYY")}
                </Box>

                <Menu isLazy>
                  <MenuButton color="primary">
                    <Icon as={FaEllipsisH} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => ViewChannelsHandler(team._id)}>
                      View channels
                    </MenuItem>

                    <MenuItem
                      color={team.isActive === true ? "danger" : "success"}
                      onClick={() =>
                        ChangeStatusHandler(team._id, team.isActive)
                      }
                    >
                      {team.isActive === true
                        ? "Deactivate team"
                        : "Restore team"}
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

const ModalComponentViewChannels = ({
  data,
  userId,
  isOpen,
  onClosed,
}: {
  data: Array<ITeam>;
  userId: string;
  isOpen: boolean;
  onClosed: () => void;
}) => {
  const [channels, setChannels] = useState<ITeam>();

  useEffect(() => {
    let selectedChannel = data.filter(({ _id }) => _id === userId);

    setChannels(selectedChannel[0]);
  }, [data, userId]);

  return (
    <ModalComponent
      title="Channels List"
      isOpen={isOpen}
      onClose={onClosed}
      size="sm"
      isCentered={false}
    >
      <Table borderColor="white" size="sm">
        <Thead>
          <Tr>
            <Th>Channel Name</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {channels?.channels.map((item) => (
            <Tr key={item._id}>
              <Td>{item.name}</Td>
              <Td>
                <Text>
                  {item.isActive ? (
                    <Badge colorScheme="green">Active</Badge>
                  ) : (
                    <Badge colorScheme="red">Deactivated</Badge>
                  )}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </ModalComponent>
  );
};

const TeamPage = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [isArchieve, setIsArchieve] = useState<boolean>(false);
  const [screenPadding, setScreenPadding] = useState<number>(4);
  const [rowId, setRowId] = useState<string>(""); // use for highlight the row of the table
  const [isActive, setIsActive] = useState<boolean>(false); // holds the user account status before submitting

  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure(); // for the drawer
  const {
    isOpen: isModelChannelOpen,
    onOpen: openModelChannel,
    onClose: closeModalChannel, // used for modal view channel
  } = useDisclosure();
  const {
    isOpen: isDialogChangeStatuOpen,
    onOpen: openDialogChangeStatus,
    onClose: closeDialogChangeStatus,
  } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const { data, isError, isLoading, isFetching, refetch } = useListTeamQuery({
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
    refetch();
  };

  const ViewChannelsHandler = useCallback(
    (_id: string) => {
      setRowId(_id);
      openModelChannel();
    },
    [openModelChannel]
  );

  const ChangeStatusHandler = useCallback(
    (_id: string, isActive: boolean) => {
      setRowId(_id);
      openDialogChangeStatus();
      setIsActive(!isActive);
    },
    [openDialogChangeStatus]
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
    refetch();
    if (isError)
      return alert("An error has occurred!, please refresh the page");
  }, [isError, refetch]);

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
        <HeadingComponent title="Manage Teams" />

        <SubHeadingComponent
          title="Teams List"
          onOpen={openDrawer}
          padding={screenPadding}
          setSearch={setSearch}
          placeHolder="Search a name: Juan"
        />

        <PageContentScroll>
          <Flex
            py={8}
            px={screenPadding}
            w="full"
            alignItems="center"
            justifyContent="space-between"
            direction={isMobile ? "column" : "row"}
          >
            {isLoading ? (
              <Text color="gray.500">Pagination is loading..</Text>
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
              ViewChannelsHandler={ViewChannelsHandler}
              ChangeStatusHandler={ChangeStatusHandler}
            />
          )}
        </PageContentScroll>
      </Flex>

      {isDrawerOpen && (
        <DrawerComponent isOpen={isDrawerOpen} onClose={closeDrawer} />
      )}

      {isModelChannelOpen && (
        <ModalComponentViewChannels
          data={data !== undefined ? data?.docs : []}
          isOpen={isModelChannelOpen}
          onClosed={closeModalChannel}
          userId={rowId}
        />
      )}

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
              this team?
            </Text>
          }
        />
      )}
    </React.Fragment>
  );
};

export default TeamPage;
