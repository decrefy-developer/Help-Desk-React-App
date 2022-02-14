import {
  Flex,
  Stack,
  HStack,
  Text,
  Skeleton,
  useDisclosure,
  Checkbox,
  CircularProgress,
  useMediaQuery,
} from "@chakra-ui/react";
import Pagination from "@choc-ui/paginator";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useChangeAccountStatusMutation,
  useListMemberQuery,
  useResetPasswordMutation,
} from "../features/member-query";
import Dialog from "../components/AlertDialog";
import HeadingComponent from "../components/Heading";
import SubHeadingComponent from "../components/SubHeading";
import PageContentScroll from "../components/PageContentScroll";

import useTableControl from "../hooks/useTableControl";
import TableComponent from "./AccountComponents/TableComponent";
import ModalChangeAccess from "./AccountComponents/ModalChangeAccess";
import ModalViewTeamsandChannels from "./AccountComponents/ModalViewChannels";
import DrawerNewMemberComponent from "./AccountComponents/DrawerNewMember";
import SkeletonPlaceHolder from "../components/SkeletonPlaceHolder";

const AccountPage = () => {
  const [isActive, setIsActive] = useState<boolean>(false); // holds the user account status
  const [isArchieve, setIsArchieve] = useState<boolean>(false);

  const {
    page,
    pageLimit,
    search,
    setSearch,
    selectedRow,
    setSelectedRow,
    onChangePage,
    onChangeLimit,
  } = useTableControl();

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

  const { data, isLoading, isFetching, isError } = useListMemberQuery({
    page,
    limit: pageLimit,
    search,
    status: !isArchieve,
  });

  const [resetPassword] = useResetPasswordMutation();
  const [changeAccountStatus] = useChangeAccountStatusMutation();

  const viewTeamAndChannel = useCallback(
    (id: string) => {
      openTeamModal();
      setSelectedRow(id);
    },
    [openTeamModal, setSelectedRow]
  );

  const ViewChangeAccess = useCallback(
    (id: string) => {
      openChangeAcessModal();
      setSelectedRow(id);
    },
    [openChangeAcessModal, setSelectedRow]
  );

  const ViewResetPassword = useCallback(
    (id: string) => {
      openDialogResetPassword();
      setSelectedRow(id);
    },
    [openDialogResetPassword, setSelectedRow]
  );

  const ViewChangeStatus = useCallback(
    (id: string, isActive: boolean) => {
      openDialogChangeStatus();
      setSelectedRow(id);
      setIsActive(!isActive);
    },
    [openDialogChangeStatus, setSelectedRow]
  );

  const ResetPassword = useCallback(async () => {
    try {
      const result = await resetPassword({ _id: selectedRow }).unwrap();
      if (result) {
        closeDialogResetPassword();
        toast.success(`${result.email} succesfully set to default password`);
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  }, [closeDialogResetPassword, resetPassword, selectedRow]);

  const ChangeStatus = useCallback(async () => {
    try {
      const result = await changeAccountStatus({
        _id: selectedRow,
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
  }, [isActive, selectedRow, closeDialogChangeStatus, changeAccountStatus]);

  useEffect(() => {
    const checkError = () => {
      if (isError)
        return alert("An error has occurred!, please refresh the page");
    };

    checkError();
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
        {!isMobile && <HeadingComponent title="Manage Members" />}
        <SubHeadingComponent
          title="Members List"
          setSearch={setSearch}
          onOpen={openDrawer}
          padding={screenPadding}
          placeHolder="Search an email: admin@gmail.com"
        />

        <PageContentScroll minH="550px">
          <Flex
            py={8}
            px={screenPadding}
            w="full"
            alignItems="center"
            justifyContent="space-between"
            direction={isMobile ? "column" : "row"}
          >
            {isLoading ? (
              <Text color="gray.500">Pagination loading..</Text>
            ) : (
              <HStack>
                <Pagination
                  currentPage={page}
                  total={data?.totalDocs}
                  paginationProps={{ display: "flex" }}
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
            <Stack w="full" py={10} px={screenPadding}>
              <SkeletonPlaceHolder count={7} />
            </Stack>
          ) : (
            <TableComponent
              data={data}
              viewTeamAndChannel={viewTeamAndChannel}
              ViewChangeAccess={ViewChangeAccess}
              ViewResetPassword={ViewResetPassword}
              ViewChangeStatus={ViewChangeStatus}
              rowId={selectedRow}
              padding={screenPadding}
            />
          )}
        </PageContentScroll>
      </Flex>

      {isDrawerOpen && (
        <DrawerNewMemberComponent isOpen={isDrawerOpen} onClose={closeDrawer} />
      )}

      {isViewTeamOpen && (
        <ModalViewTeamsandChannels
          isOpen={isViewTeamOpen}
          onClose={closeTeamModal}
          userId={selectedRow}
        />
      )}

      {isChangeAcessOpen && (
        <ModalChangeAccess
          isOpen={isChangeAcessOpen}
          onClose={closeChangeAccessModal}
          userId={selectedRow}
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
