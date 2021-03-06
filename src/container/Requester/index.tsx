import {
  Checkbox,
  CircularProgress,
  Flex,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import HeadingComponent from '../../components/Heading';
import PageContentScroll from '../../components/PageContentScroll';
import SubHeadingComponent from './SubHeadingComponent';
import { useListRequestQuery } from '../../app/features/request-query';
import useTableControl from '../../hooks/useTableControl';
import SkeletonPlaceHolder from '../../components/SkeletonPlaceHolder';
import Pagination from '@choc-ui/paginator';
import TableComponent from './TableComponent';
import { DecodeToken } from '../../utils/decode-token';
import { ACCESS, IRequest, IUser } from '../../models/interface';
import DrawerTicket from '../../components/DrawerTicket/DrawerTicket';
import ModalView from './ModalView';
import useScreenPadding from '../../hooks/useScreenPadding';

const Requester = () => {
  const [status, setStatus] = useState<boolean>(false);
  const decoded: IUser | null = DecodeToken();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { screenPadding } = useScreenPadding({ minPadding: 4, maxPadding: 10 });
  const {
    isOpen: isModalOpen,
    onClose: closeModal,
    onOpen: openModal,
  } = useDisclosure();
  const [formStateHolder, setFormStateHolder] = useState<IRequest>();

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

  const {
    data: requests,
    isLoading,
    isFetching,
  } = useListRequestQuery({
    page,
    limit: pageLimit,
    search,
    status: status,
    userId:
      decoded && decoded.priviledge.includes(ACCESS.CREATE_TICKET)
        ? ''
        : decoded?._id,
  });

  const creatTicketHandler = (data: IRequest) => {
    onOpen();
    setFormStateHolder(data);
  };

  const openModalHandler = (_id: string) => {
    openModal();
    setSelectedRow(_id);
  };

  const FilterByStatusHandler = (isChecked: boolean) => {
    setStatus(isChecked);
  };

  return (
    <React.Fragment>
      <Flex w="full" flexDirection="column">
        <HeadingComponent title="Request a concern" />

        <SubHeadingComponent
          screenPadding={screenPadding}
          setTextSearch={setSearch}
        />

        <PageContentScroll>
          <Flex
            py={4}
            px={screenPadding}
            w="full"
            alignItems="center"
            justifyContent="space-between"
          >
            {isLoading ? (
              <Text color="gray.500">Pagination loading..</Text>
            ) : (
              <HStack>
                <Pagination
                  currentPage={page}
                  total={requests?.totalDocs}
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
                  Items: {requests?.totalDocs}
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
                <Text fontSize="sm" color="gray.500"></Text>
                show completed
              </Checkbox>
            </HStack>
          </Flex>

          {isLoading ? (
            <Stack w="full" py={10} px={screenPadding}>
              <SkeletonPlaceHolder count={7} />
            </Stack>
          ) : (
            <TableComponent
              data={requests}
              padding={screenPadding}
              rowId={selectedRow}
              openDrawer={creatTicketHandler}
              openModal={openModalHandler}
            />
          )}
        </PageContentScroll>
      </Flex>

      {isOpen && (
        <DrawerTicket
          formData={formStateHolder ? formStateHolder : null}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}

      {isModalOpen && (
        <ModalView
          rowId={selectedRow}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </React.Fragment>
  );
};

export default Requester;
