import {
  Checkbox,
  CircularProgress,
  Flex,
  HStack,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import Pagination from '@choc-ui/paginator';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import {
  useChangeStatusMutation,
  useListDepartmentQuery,
} from '../../app/features/department-query';
import Dialog from '../../components/AlertDialog';
import HeadingComponent from '../../components/Heading';
import PageContentScroll from '../../components/PageContentScroll';
import SkeletonPlaceHolder from '../../components/SkeletonPlaceHolder';
import SubHeadingComponent from '../../components/SubHeading';
import useScreenPadding from '../../hooks/useScreenPadding';
import useTableControl from '../../hooks/useTableControl';

import DrawerComponent from './DrawerComponent';
import ModalViewUnit from './ModalViewUnit';
import TableComponent from './TableComponent';

const Department = () => {
  const [isArchieve, setIsArchieve] = useState<boolean>(false);
  const { screenPadding } = useScreenPadding({ minPadding: 4, maxPadding: 10 });
  const [isMobile] = useMediaQuery('(max-width: 600px)');
  const [isActive, setIsActive] = useState<boolean>(false); // holds the selected item status before submitting

  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure(); // for the drawer
  const {
    isOpen: isModalUnitOpen,
    onOpen: openModalUnit,
    onClose: closeModalUnit, // used for modal view unit
  } = useDisclosure();
  const {
    isOpen: isDialogChangeStatuOpen,
    onOpen: openDialogChangeStatus,
    onClose: closeDialogChangeStatus,
  } = useDisclosure();

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

  const [changeStatus] = useChangeStatusMutation();
  const { data, isLoading, isFetching } = useListDepartmentQuery({
    page,
    limit: pageLimit,
    search,
    status: !isArchieve,
  });

  const ViewUnitsHandler = useCallback(
    (_id: string) => {
      setSelectedRow(_id);
      openModalUnit();
    },
    [openModalUnit, setSelectedRow]
  );

  const ChangeStatusHandler = useCallback(
    (_id: string, isActive: boolean) => {
      setSelectedRow(_id);
      setIsActive(!isActive);
      openDialogChangeStatus();
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
          `${result.name} was ${isActive ? 'actived' : 'deactivated'}`
        );
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  }, [isActive, selectedRow]);

  const FilterByStatusHandler = (status: boolean) => {
    setIsArchieve(status);
  };

  return (
    <React.Fragment>
      <Flex w="full" flexDirection="column">
        <HeadingComponent title="Manage Deparments" />

        <SubHeadingComponent
          title="Department List"
          onOpen={openDrawer}
          padding={screenPadding}
          setSearch={setSearch}
          placeHolder="Seach a department name:"
        />

        <PageContentScroll>
          <Flex
            py={8}
            px={screenPadding}
            w="full"
            alignItems="center"
            justifyContent="space-between"
            direction={isMobile ? 'column' : 'row'}
          >
            {isLoading ? (
              <Text color="gray.500">Pagination is loading..</Text>
            ) : (
              <HStack>
                <Pagination
                  currentPage={page}
                  total={data?.totalDocs}
                  paginationProps={{ display: 'flex' }}
                  baseStyles={{ border: '1px' }}
                  activeStyles={{ bg: 'primary' }}
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

              <Checkbox
                onChange={(e) => FilterByStatusHandler(e.target.checked)}
              >
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
              viewUnitsHandler={ViewUnitsHandler}
              ChangeStatusHandler={ChangeStatusHandler}
            />
          )}
        </PageContentScroll>
      </Flex>

      {isDrawerOpen && (
        <DrawerComponent isOpen={isDrawerOpen} onClose={closeDrawer} />
      )}

      {isModalUnitOpen && (
        <ModalViewUnit
          rowId={selectedRow}
          isOpen={isModalUnitOpen}
          onClosed={closeModalUnit}
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
              <i style={{ color: '#d65db1' }}>
                {isActive ? ' activate ' : ' deactive '}
              </i>
              this team?
            </Text>
          }
        />
      )}
    </React.Fragment>
  );
};

export default Department;
