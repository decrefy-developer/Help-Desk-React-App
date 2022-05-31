import {
  Checkbox,
  CircularProgress,
  Flex,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import Pagination from "@choc-ui/paginator";
import React, { useCallback, useEffect, useState } from "react";
import HeadingComponent from "../../components/Heading";
import SubHeadingComponent from "../../components/SubHeading";
import Dialog from "../../components/AlertDialog";
import {
  useChangeStatusMutation,
  useListChannelQuery,
} from "../../app/features/channel-query";
import { toast } from "react-toastify";
import PageContentScroll from "../../components/PageContentScroll";
import useTableControl from "../../hooks/useTableControl";
import DrawerComponent from "./DrawerComponent";
import TableComponent from "./TableComponent";
import SkeletonPlaceHolder from "../../components/SkeletonPlaceHolder";
import ModalViewMember from "./ModalViewMember";
import useScreenPadding from "../../hooks/useScreenPadding";

const Channel = () => {
  const { screenPadding } = useScreenPadding({ minPadding: 4, maxPadding: 10 });
  const [isArchieve, setIsArchieve] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false); // holds the user account status before submitting
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const {
    page,
    pageLimit,
    search,
    setSearch,
    selectedRow,
    setSelectedRow,
    onChangeLimit,
    onChangePage,
  } = useTableControl();

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

  const { data, isError, isLoading, isFetching } = useListChannelQuery({
    page,
    limit: pageLimit,
    search,
    status: !isArchieve,
  });

  const [changeStatus] = useChangeStatusMutation();

  const ChangeStatusHandler = useCallback(
    (_id: string, isActive: boolean) => {
      setSelectedRow(_id);
      setIsActive(!isActive);
      openDialogChangeStatus();
    },
    [openDialogChangeStatus, setSelectedRow]
  );

  const ViewMembersHandler = useCallback(
    (_id: string) => {
      setSelectedRow(_id);
      openModal();
    },
    [openModal, setSelectedRow]
  );

  const changeStatusSubmit = useCallback(async () => {
    try {
      const result = await changeStatus({
        _id: selectedRow,
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
  }, [closeDialogChangeStatus, isActive, selectedRow, changeStatus]);

  useEffect(() => {
    if (isError)
      return alert("An error has occured!, please reafresh the page ");
  }, [isError]);

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
              rowId={selectedRow}
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
        <ModalViewMember
          selectedRow={selectedRow}
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

export default Channel;
