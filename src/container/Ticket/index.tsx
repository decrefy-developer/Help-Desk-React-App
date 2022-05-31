import {
  Checkbox,
  CircularProgress,
  Flex,
  HStack,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import HeadingComponent from '../../components/Heading';
import PageContentScroll from '../../components/PageContentScroll';
import SubHeading from './SubHeading';
import useScreenPadding from '../../hooks/useScreenPadding';
import useTableControl from '../../hooks/useTableControl';
import { ITicket, STATE, STATUS } from '../../models/interface';
import SkeletonPlaceHolder from '../../components/SkeletonPlaceHolder';
import { useListFillingTicketQuery } from '../../app/features/filling-query';
import TableComponent from './TableComponent';
import Pagination from '@choc-ui/paginator';
import ModalViewDetails from './ModalViewDetails';

const Ticket = () => {
  const { screenPadding } = useScreenPadding({ minPadding: 4, maxPadding: 10 });
  const {
    onChangePage,
    onChangeLimit,
    page,
    pageLimit,
    selectedRow,
    setSelectedRow,
  } = useTableControl();
  const [state] = useState(STATE.DONE);

  const [status] = useState(STATUS.CLOSED);
  const [textSearch, setTextSearch] = useState<string>('');
  const [channel, setChannel] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [selectedTicket, setSelectedTicket] = useState<ITicket>();
  const viewDetailsModal = useDisclosure();
  const [isFiled, setIsFiled] = useState<boolean>(false);

  const {
    data: tickets,
    isLoading,
    isFetching,
  } = useListFillingTicketQuery({
    page: 1,
    limit: 10,
    channelId: channel,
    departmentId: department,
    search: textSearch,
    statusTicket: status,
    state: state,
    isFiled,
  });

  function ClearFilter() {
    setDepartment('');
    setChannel('');
  }

  function openModalHandler(data: ITicket) {
    viewDetailsModal.onOpen();
    setSelectedTicket(data);
    setSelectedRow(data._id);
  }

  return (
    <Flex flexDirection="column" w="full">
      <HeadingComponent title="Filling" />
      <SubHeading
        screenPadding={screenPadding}
        setText={setTextSearch}
        setChannel={setChannel}
        setDepartment={setDepartment}
        reset={ClearFilter}
      />

      <Flex
        py={8}
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
              total={tickets?.totalDocs}
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
              Items: {tickets?.totalDocs}
            </Text>
          </HStack>
        )}

        <HStack alignContent="center">
          {isFetching && (
            <CircularProgress isIndeterminate color="primary" size="30px" />
          )}

          <Checkbox onChange={(e) => setIsFiled(e.target.checked)}>
            <Text fontSize="sm" color="gray.500">
              show filed
            </Text>
          </Checkbox>
        </HStack>
      </Flex>

      <PageContentScroll>
        {isLoading ? (
          <Stack py={10} px={screenPadding}>
            <SkeletonPlaceHolder count={7} />
          </Stack>
        ) : (
          <TableComponent
            data={tickets}
            rowId={selectedRow}
            padding={screenPadding}
            viewDetailsHandler={openModalHandler}
          />
        )}
      </PageContentScroll>

      <ModalViewDetails modal={viewDetailsModal} data={selectedTicket} />
    </Flex>
  );
};

export default Ticket;
