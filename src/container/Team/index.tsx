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
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import HeadingComponent from "../../components/Heading";
import {
  useListTeamQuery,
  useChangeStatusMutation,
} from "../../app/features/team-query";
import Pagination from "@choc-ui/paginator";
import Dialog from "../../components/AlertDialog";
import SubHeadingComponent from "../../components/SubHeading";
import PageContentScroll from "../../components/PageContentScroll";
import useTableControl from "../../hooks/useTableControl";
import SkeletonPlaceHolder from "../../components/SkeletonPlaceHolder";
import DrawerComponent from "./DrawerComponent";
import ModalViewChannel from "./ModalViewChannel";
import TableComponent from "./TableComponent";

const Team = () => {
  const [isArchieve, setIsArchieve] = useState<boolean>(false);
  const [screenPadding, setScreenPadding] = useState<number>(4);
  const [isActive, setIsActive] = useState<boolean>(false); // holds the user account status before submitting

  const {
    page,
    pageLimit,
    search,
    setSearch,
    selectedRow,
    onChangePage,
    onChangeLimit,
    setSelectedRow,
  } = useTableControl();

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
    limit: pageLimit,
    search,
    status: !isArchieve,
  });
  const [changeStatus] = useChangeStatusMutation();

  const ViewChannelsHandler = useCallback(
    (_id: string) => {
      setSelectedRow(_id);
      openModelChannel();
    },
    [openModelChannel, setSelectedRow]
  );

  const ChangeStatusHandler = useCallback(
    (_id: string, isActive: boolean) => {
      setSelectedRow(_id);
      openDialogChangeStatus();
      setIsActive(!isActive);
    },
    [openDialogChangeStatus, setSelectedRow]
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
              <Text color="gray.500">Pagination is loading..</Text>
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
        <ModalViewChannel
          data={data !== undefined ? data?.docs : []}
          isOpen={isModelChannelOpen}
          onClosed={closeModalChannel}
          userId={selectedRow}
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

export default Team;
