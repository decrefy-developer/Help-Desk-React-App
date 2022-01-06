import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Stack,
  HStack,
  Text,
  Thead,
  Tr,
  Th,
  Td,
  InputRightElement,
  Table,
  Tbody,
  Avatar,
  Skeleton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Drawer,
  DrawerBody,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  FormLabel,
  Checkbox,
  Box,
  DrawerFooter,
  DrawerOverlay,
  CircularProgress,
  ModalFooter,
  useColorModeValue,
  useMediaQuery,
  SimpleGrid,
  chakra,
  useBreakpointValue,
} from "@chakra-ui/react";
import Pagination from "@choc-ui/paginator";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Heading from "../components/Heading";
import { FaSearch, FaEllipsisH } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import StyleContext from "../context/StyleContext";
import {
  IMember,
  useAddMemberMutation,
  useChangeAccountStatusMutation,
  useChannelsOfTheUserQuery,
  useGetMemberQuery,
  useListMemberQuery,
  useResetPasswordMutation,
  useUpdateMemberAcessMutation,
} from "../features/member-query";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ListResponse } from "../features/data-types";
import ModalComponent from "../components/Modal";
import Dialog from "../components/AlertDialog";
import moment from "moment";

export interface IFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
  priviledge: Array<string>;
}

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Password is too short - should be 6 chars minimum.")
    .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const SubHeadingComponent: React.FC<{
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  onOpen: () => void;
  padding: number;
}> = ({ setSearch, onOpen, padding }) => {
  const { borderLine } = useContext(StyleContext);

  const [searchText, setSeachText] = useState<string>("");

  const SearchSubmit = () => {
    setSearch(searchText);
  };
  return (
    <Flex
      flexDirection="column"
      borderBottom="1px"
      borderColor={borderLine}
      py={8}
      px={padding}
    >
      <HStack justify="space-between">
        <Stack>
          <Text fontSize="x-large">Memberlist</Text>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button size="sm" variant="outline">
            Export
          </Button>
          <Button size="sm" bg="primary" onClick={onOpen}>
            Add Member
          </Button>
        </Stack>
      </HStack>

      <HStack mt={5}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<FaSearch color="gray.300" />}
          />
          <Input
            type="text"
            placeholder="Seach member: Enter email"
            variant="filled"
            onChange={(e) => setSeachText(e.target.value)}
          />
        </InputGroup>
        <Button bg="#1dddcb" fontSize="sm" onClick={SearchSubmit}>
          Search
        </Button>
      </HStack>
    </Flex>
  );
};

const DrawerNewMember = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const firstField = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [checkedAccess, setCheckedAccess] = useState<Array<string>>([]);
  const [checboxError, setCheckboxError] = useState(false);
  const [addMember, { isLoading }] = useAddMemberMutation();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<IFormInputs>({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      email: " ",
      password: "",
      confirmPassword: "",
      priviledge: [],
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    try {
      if (checkedAccess.length <= 0) return setCheckboxError(true);
      data.priviledge = checkedAccess;

      const result = await addMember(data).unwrap();
      if (result) {
        onClose();
        reset();
        toast.success(`${result.email} has been successfully added`);
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  const showPasswordHandler = () => setShowPassword(!showPassword);

  const setAccess = (isChecked: boolean, item: string) => {
    if (isChecked) {
      setCheckedAccess([...checkedAccess, item]);
    } else {
      setCheckedAccess(checkedAccess.filter((access) => access !== item));
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      initialFocusRef={firstField}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <DrawerOverlay />
      <DrawerContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Create a new account
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  type="email"
                  autoComplete="flase"
                  id="email"
                  placeholder="Please enter email"
                  {...register("email")}
                />
                <Text textAlign="left" fontSize="xs" p={1} color="danger">
                  {errors.email?.message}
                </Text>
              </Box>

              <Box>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Please enter password"
                    {...register("password")}
                  />
                  <InputRightElement>
                    <Icon
                      _hover={{ cursor: "pointer" }}
                      as={showPassword ? FaEyeSlash : FaEye}
                      onClick={showPasswordHandler}
                    />
                  </InputRightElement>
                </InputGroup>
                <Text textAlign="left" fontSize="xs" p={1} color="danger">
                  {errors.password?.message}
                </Text>
              </Box>

              <Box>
                <FormLabel htmlFor="confirm-password">
                  Confirm-password
                </FormLabel>
                <Input
                  type="password"
                  id="confirm-password"
                  placeholder="Please enter confirm-password"
                  {...register("confirmPassword")}
                />
                <Text textAlign="left" fontSize="xs" p={1} color="danger">
                  {errors.confirmPassword?.message}
                </Text>
              </Box>

              <Box>
                <Stack spacing={2}>
                  <FormLabel>Access</FormLabel>
                  <Checkbox
                    onChange={(e) => setAccess(e.target.checked, "MEMBERS")}
                  >
                    Manage Members
                  </Checkbox>
                  <Checkbox
                    onChange={(e) => setAccess(e.target.checked, "TEAMS")}
                  >
                    Manage Teams
                  </Checkbox>
                  <Checkbox
                    onChange={(e) => setAccess(e.target.checked, "CHANNELS")}
                  >
                    Manage Channels
                  </Checkbox>
                  <Checkbox
                    onChange={(e) => setAccess(e.target.checked, "CATEGORY")}
                  >
                    Manage Category Concern
                  </Checkbox>
                  <Checkbox
                    onChange={(e) => setAccess(e.target.checked, "CUSTOMERS")}
                  >
                    Manage Customers
                  </Checkbox>
                  <Text textAlign="left" fontSize="xs" p={1} color="danger">
                    {checboxError && "Please check atleast one"}
                  </Text>
                </Stack>
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
        </form>
      </DrawerContent>
    </Drawer>
  );
};

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
                  [ {user.priviledge.join(" , ").toLowerCase()} ]
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
                    <MenuItem onClick={() => ViewChangeAccess(user._id)}>
                      Change account access
                    </MenuItem>
                    <MenuItem
                      color="warning"
                      onClick={() => ViewResetPassword(user._id)}
                    >
                      Reset password
                    </MenuItem>
                    <MenuItem
                      color="danger"
                      onClick={() => ViewChangeStatus(user._id, user.isActive)}
                    >
                      Deactivate account
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

const ModalViewTeamsandChannels = ({
  isOpen,
  onClose,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}) => {
  const { data: datas, isFetching } = useChannelsOfTheUserQuery(userId);
  return (
    <ModalComponent
      title="Teams & Channels"
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered={false}
    >
      {isFetching ? (
        <Stack w="full" py={10}>
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : datas && datas?.length <= 0 ? (
        <Text color="danger" as="em">
          No teams and channels found.
        </Text>
      ) : (
        <Table borderColor="white" size="sm">
          <Thead>
            <Tr>
              <Th>Teams</Th>
              <Th>Channels Group</Th>
            </Tr>
          </Thead>
          <Tbody>
            {datas?.map((item) => (
              <Tr key={item._id}>
                <Td>{item._id}</Td>
                <Td>[ {item.channels.join(" , ")} ]</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </ModalComponent>
  );
};

const ModalChangeAccess = ({
  isOpen,
  onClose,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}) => {
  const [checkedAccess, setCheckedAccess] = useState<Array<string>>([]);
  const { data, isFetching } = useGetMemberQuery(userId);
  const [isError, setIsError] = useState<boolean>(false);
  const [updateMemberAcess] = useUpdateMemberAcessMutation();

  const setAccess = (isChecked: boolean, item: string) => {
    if (isChecked) {
      setCheckedAccess([...checkedAccess, item]);
    } else {
      setCheckedAccess(checkedAccess.filter((access) => access !== item));
    }
  };

  const onSubmit = async () => {
    if (checkedAccess.length <= 0) return setIsError(true);

    try {
      const result = await updateMemberAcess({
        _id: userId,
        priviledge: checkedAccess,
      }).unwrap();

      if (result) {
        onClose();
        toast.success(`${result.email} access has changed`);
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }

    setIsError(false);
  };

  useEffect(() => {
    if (data) setCheckedAccess(data?.priviledge);
  }, [data]);

  return (
    <ModalComponent
      title="Account Access"
      isOpen={isOpen}
      onClose={onClose}
      isCentered={true}
    >
      {isFetching ? (
        <Stack w="full" py={10} px="20">
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : (
        <Box pb={5}>
          <Stack spacing={2}>
            <FormLabel>Access</FormLabel>
            <Checkbox
              isChecked={checkedAccess.includes("MEMBERS") ? true : false}
              onChange={(e) => setAccess(e.target.checked, "MEMBERS")}
            >
              Manage Members
            </Checkbox>
            <Checkbox
              isChecked={checkedAccess.includes("TEAMS") ? true : false}
              onChange={(e) => setAccess(e.target.checked, "TEAMS")}
            >
              Manage Teams
            </Checkbox>
            <Checkbox
              isChecked={checkedAccess.includes("CHANNELS") ? true : false}
              onChange={(e) => setAccess(e.target.checked, "CHANNELS")}
            >
              Manage Channels
            </Checkbox>
            <Checkbox
              isChecked={checkedAccess.includes("CATEGORY") ? true : false}
              onChange={(e) => setAccess(e.target.checked, "CATEGORY")}
            >
              Manage Category Concern
            </Checkbox>
            <Checkbox
              isChecked={checkedAccess.includes("CUSTOMERS") ? true : false}
              onChange={(e) => setAccess(e.target.checked, "CUSTOMERS")}
            >
              Manage Customers
            </Checkbox>
          </Stack>
          <Text textAlign="left" fontSize="xs" mt={3} color="danger">
            {isError && "Please select atleast one"}
          </Text>
        </Box>
      )}
      <ModalFooter p="0px" mb="8px">
        <Button variant="solid" bg="primary" size="sm" onClick={onSubmit}>
          Update Changes
        </Button>
      </ModalFooter>
    </ModalComponent>
  );
};

const AccountPage = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [rowId, setRowId] = useState<string>(""); // use for highlight the row of the table
  const [isActive, setIsActive] = useState<boolean>(false); // holds the user account status
  const [isArchieve, setIsArchieve] = useState<boolean>(false);

  const [screenPadding, setScreenPadding] = useState<number>(4);
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure(); // for the drawer
  const {
    isOpen: isViewTeamOpen,
    onOpen: openTeamModal,
    onClose: closeTeamModal,
  } = useDisclosure(); // for modal of view teams & channel
  const {
    isOpen: isChangeAcessOpen,
    onOpen: openChangeAcessModal,
    onClose: closeChangeAccessModal,
  } = useDisclosure(); // for modal Change Acess
  const {
    isOpen: isDialogResetPasswordOpen,
    onOpen: openDialogResetPassword,
    onClose: closeDialogResetPassword,
  } = useDisclosure(); // for dialog reset password
  const {
    isOpen: isDialogChangeStatusOpen,
    onOpen: openDialogChangeStatus,
    onClose: closeDialogChangeStatus,
  } = useDisclosure(); // for dialog deactive or active account

  const { data, isLoading, isFetching, isError, refetch } = useListMemberQuery({
    page,
    limit,
    search,
    status: !isArchieve,
  });

  const [resetPassword] = useResetPasswordMutation();
  const [changeAccountStatus] = useChangeAccountStatusMutation();

  const onChangePage = (pageNumber: any) => {
    setPage(Number(pageNumber));
  };

  const onChangeLimit = (limitNumber: any) => {
    setLimit(Number(limitNumber));
    refetch();
  };

  const viewTeamAndChannel = useCallback(
    (id: string) => {
      openTeamModal();
      setRowId(id);
    },
    [openTeamModal]
  );

  const ViewChangeAccess = useCallback(
    (id: string) => {
      openChangeAcessModal();
      setRowId(id);
    },
    [openChangeAcessModal]
  );

  const ViewResetPassword = useCallback(
    (id: string) => {
      openDialogResetPassword();
      setRowId(id);
    },
    [openDialogResetPassword]
  );

  const ViewChangeStatus = useCallback(
    (id: string, isActive: boolean) => {
      openDialogChangeStatus();
      setRowId(id);
      setIsActive(!isActive);
    },
    [openDialogChangeStatus]
  );

  const ResetPassword = useCallback(async () => {
    try {
      const result = await resetPassword({ _id: rowId }).unwrap();
      if (result) {
        closeDialogResetPassword();
        toast.success(`${result.email} succesfully set to default password`);
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  }, [closeDialogResetPassword, resetPassword, rowId]);

  const ChangeStatus = useCallback(async () => {
    try {
      const result = await changeAccountStatus({
        _id: rowId,
        isActive: isActive,
      }).unwrap();
      if (result) {
        closeDialogChangeStatus();
        toast.success(
          `${result.email} is ${isActive ? "activated" : `deactivated`}`
        );
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  }, [isActive, rowId, closeDialogChangeStatus, changeAccountStatus]);

  useEffect(() => {
    const checkError = () => {
      if (isError)
        return alert("An error has occurred!, please refresh the page");
    };

    if (isMobile === false) {
      setScreenPadding(20);
    } else {
      setScreenPadding(4);
    }

    checkError();
  }, [isError, isMobile]);

  return (
    <React.Fragment>
      <Flex w="full" flexDirection="column">
        <Heading title="Manage Members" />
        <SubHeadingComponent
          setSearch={setSearch}
          onOpen={openDrawer}
          padding={screenPadding}
        />

        <Flex
          py={8}
          px={screenPadding}
          w="full"
          alignItems="center"
          justifyContent="space-between"
          direction={isMobile ? "column" : "row"}
        >
          {isLoading ? (
            <HStack>
              <CircularProgress isIndeterminate color="primary" size="30px" />
              <Text color="gray.500">Pagination loading..</Text>
            </HStack>
          ) : (
            <HStack>
              <Pagination
                currentPage={page}
                total={data?.totalDocs}
                paginationProps={{ display: "flex" }}
                baseStyles={{ border: "1px" }}
                activeStyles={{ bg: "primary" }}
                onChange={(page) => onChangePage(page)}
                pageSize={limit}
                showSizeChanger
                onShowSizeChange={(__, size) => {
                  onChangeLimit(size);
                  onChangePage(1);
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
            viewTeamAndChannel={viewTeamAndChannel}
            ViewChangeAccess={ViewChangeAccess}
            ViewResetPassword={ViewResetPassword}
            ViewChangeStatus={ViewChangeStatus}
            rowId={rowId}
            padding={screenPadding}
          />
        )}
      </Flex>

      {isDrawerOpen && (
        <DrawerNewMember isOpen={isDrawerOpen} onClose={closeDrawer} />
      )}

      {isViewTeamOpen && (
        <ModalViewTeamsandChannels
          isOpen={isViewTeamOpen}
          onClose={closeTeamModal}
          userId={rowId}
        />
      )}

      {isChangeAcessOpen && (
        <ModalChangeAccess
          isOpen={isChangeAcessOpen}
          onClose={closeChangeAccessModal}
          userId={rowId}
        />
      )}

      {isDialogResetPasswordOpen && (
        <Dialog
          title="Resetting password"
          isOpen={isDialogResetPasswordOpen}
          onClose={closeDialogResetPassword}
          children={
            <Text>
              The password will be <i style={{ color: "#d65db1" }}>123456</i>
            </Text>
          }
          onSubmit={ResetPassword}
        />
      )}

      {isDialogChangeStatusOpen && (
        <Dialog
          title="Changing account status"
          isOpen={isDialogChangeStatusOpen}
          onClose={closeDialogChangeStatus}
          onSubmit={ChangeStatus}
          children={
            <Text>
              Do you want to
              <i style={{ color: "#d65db1" }}>
                {isActive ? " activate " : " deactive "}
              </i>
              this account?
            </Text>
          }
        />
      )}
    </React.Fragment>
  );
};

export default AccountPage;
