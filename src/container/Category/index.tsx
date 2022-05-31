import { Checkbox } from '@chakra-ui/checkbox';
import { useDisclosure } from '@chakra-ui/hooks';
import { Flex, HStack, Stack, Text } from '@chakra-ui/layout';
import { useMediaQuery } from '@chakra-ui/media-query';
import { CircularProgress } from '@chakra-ui/progress';
import Pagination from '@choc-ui/paginator';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import {
  useChangeStatusMutation,
  useListCategoryConcernQuery,
} from '../../app/features/category-query';
import Dialog from '../../components/AlertDialog';
import HeadingComponent from '../../components/Heading';
import PageContentScroll from '../../components/PageContentScroll';
import SkeletonPlaceHolder from '../../components/SkeletonPlaceHolder';
import SubHeadingComponent from '../../components/SubHeading';
import useScreenPadding from '../../hooks/useScreenPadding';
import useTableControl from '../../hooks/useTableControl';
import DrawerComponent from './DrawerComponent';
import ModalViewUnitSubUnit from './ModalViewSubUnit';
import TableComponent from './TableComponent';

const Category = () => {
  const { screenPadding } = useScreenPadding({ minPadding: 4, maxPadding: 10 });
  const [isMobile] = useMediaQuery('(max-width: 600px)');
  const [isArchieve, setIsArchieve] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false); // holds the selected item status before submitting

  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure(); // for the drawer
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
    data: categories,
    isLoading,
    isFetching,
  } = useListCategoryConcernQuery({
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

  const ViewSubUnitHandler = useCallback(
    (_id: string) => {
      setSelectedRow(_id);
      openModal();
    },
    [setSelectedRow]
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

  function FilterByStatusHandler(status: boolean) {
    setIsArchieve(status);
  }

  return (
    <>
      <Flex w="full" flexDirection="column">
        <HeadingComponent title="Manage Categories" />

        <SubHeadingComponent
          title="Category List"
          onOpen={openDrawer}
          padding={screenPadding}
          setSearch={setSearch}
          placeHolder="Search a category name:"
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
                  total={categories?.totalDocs}
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
                  Items: {categories?.totalDocs}
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
              data={categories}
              rowId={selectedRow}
              padding={screenPadding}
              viewSubUnit={ViewSubUnitHandler}
              ChangeStatusHandler={ChangeStatusHandler}
            />
          )}
        </PageContentScroll>
      </Flex>

      {isDrawerOpen && (
        <DrawerComponent isOpen={isDrawerOpen} onClose={closeDrawer} />
      )}

      {isModalOpen && (
        <ModalViewUnitSubUnit
          rowId={selectedRow}
          isOpen={isModalOpen}
          onClosed={closeModal}
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
    </>
  );
};

export default Category;
