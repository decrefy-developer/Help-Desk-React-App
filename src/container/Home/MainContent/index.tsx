import {
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
  useMediaQuery,
  VStack,
} from '@chakra-ui/react';
import Pagination from '@choc-ui/paginator';
import moment from 'moment';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaClock } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Dialog from '../../../components/AlertDialog';
import SkeletonPlaceHolder from '../../../components/SkeletonPlaceHolder';
import StyleContext from '../../../context/StyleContext';
import {
  useCancelTicketMutation,
  useCloseTicketMutation,
  useListTicketsQuery,
  useSeenTheTicketMutation,
} from '../../../app/features/ticket-query';
import useTableControl from '../../../hooks/useTableControl';
import { ITicket, STATE, STATUS } from '../../../models/interface';
import HeadingComponent from './HeadingComponent';
import ModalMember from './ModalMember';
import TopNavComponent from './TopNavComponent';

import PrintPageHM from './PrintPage/HM/PrintPage_HM';
import ModalDoneTicket from './ModalDoneTicket';
import PrintPageSI from './PrintPage/SI/PrintPage_SI';
import RePrint_SI from './PrintPage/SI/RePrint_SI';
import SelectedTicket from './SelectedTicket';
import RePrint from './PrintPage/HM/RePrint_HM';
import PrintPageSS from './PrintPage/SS/PrintPage_SS';
import PageContentScroll from '../../../components/PageContentScroll';

const MainContent = () => {
  const { channelId } = useParams();
  const { borderLine } = useContext(StyleContext);
  const [selectedTicket, setSelectedTicket] = useState<ITicket>();
  const [selectedRow, setSelectedRow] = useState<string>('');
  const [state, setState] = useState(STATE.PENDING);
  const [status, setStatus] = useState(STATUS.OPEN);
  const [textSearch, setTextSearch] = useState<string>('');
  const [screenSize, getDimension] = useState({
    dynamicHeight: window.innerHeight * 0.3,
  });
  const [isMobile] = useMediaQuery('(max-width: 991px)');
  const memberModal = useDisclosure();
  const doneModal = useDisclosure();
  const CLOSING_TICKET_DIALOG = useDisclosure();
  const CANCELLING_TICKET_DIALOG = useDisclosure();
  const PRINT_MODAL_HM = useDisclosure();
  const RE_PRINT_HM = useDisclosure();
  const PRINT_MODAL_SI = useDisclosure();
  const RE_PRINT_SI = useDisclosure();
  const PRINT_MODAL_SS = useDisclosure();
  const RE_PRINT_SS = useDisclosure();
  const { onChangePage, onChangeLimit, page, pageLimit } = useTableControl();

  const [closeTicket] = useCloseTicketMutation();
  const [cancelTicket] = useCancelTicketMutation();

  const [seenTheTicket, { isLoading: loadingToSeen }] =
    useSeenTheTicketMutation();
  const componentRef = useRef<HTMLDivElement>(null);

  const {
    data: tickets,
    isFetching,
    isLoading,
  } = useListTicketsQuery({
    page: 1,
    limit: 10,
    search: textSearch,
    channelId: channelId ? channelId : '',
    statusTicket: status,
    state: state,
  });

  const setDimension = () => {
    getDimension({ dynamicHeight: window.innerHeight * 0.3 });
  };

  const selectStateHandler = (value: STATE) => {
    setState(value);
    setStatus(STATUS.OPEN);
    setSelectedTicket(undefined);
  };

  const selectStatusHandler = (value: STATUS) => {
    setStatus(value);
    setSelectedTicket(undefined);
    if (value !== STATUS.OPEN) {
      setState(STATE.DONE);
    }
  };

  const selectTicketHandler = async (data: ITicket) => {
    try {
      if (isMobile)
        return alert(
          'This function cannot supported in this screen size, please make your screen full'
        );
      if (data.seen === false) {
        const result = await seenTheTicket(data._id).unwrap();
        if (result) {
          setSelectedTicket(data);
          setSelectedRow(data._id);
        }
      } else {
        setSelectedTicket(data);
        setSelectedRow(data._id);
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  const closeTicketHandler = async () => {
    try {
      if (selectedTicket?._id) {
        const result = await closeTicket({
          _id: selectedTicket._id,
          mode: 'CLOSING TICKET',
        }).unwrap();

        if (result) {
          toast.success(`# ${result.tickNumber} has been closed successfully`);
          setSelectedTicket(undefined);
          CLOSING_TICKET_DIALOG.onClose();
        }
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  const cancelTicketHandler = async () => {
    try {
      if (selectedTicket?._id) {
        const result = await cancelTicket({
          _id: selectedTicket._id,
          mode: 'CANCELLING TICKET',
        }).unwrap();

        if (result) {
          toast.success(
            `# ${result.ticketNumber} has been cancelled succesfully`
          );
          setSelectedTicket(undefined);
          CANCELLING_TICKET_DIALOG.onClose();
        }
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', setDimension);

    return () => {
      window.removeEventListener('resize', setDimension);
    };
  }, [screenSize]);

  return (
    <>
      <Flex w="full" flexDirection="column">
        <HeadingComponent openModal={memberModal.onOpen} />
        {memberModal.isOpen && (
          <ModalMember
            isOpen={memberModal.isOpen}
            onClose={memberModal.onClose}
          />
        )}

        <TopNavComponent
          setTextSearch={setTextSearch}
          setStatus={selectStatusHandler}
          setState={selectStateHandler}
          status={status}
          state={state}
        />

        <Flex flexDirection="row" px={3}>
          <Flex
            w={{ base: '100%', md: '100%', lg: '30%' }}
            flexDirection="column"
          >
            <Flex py={3} px={3}>
              {isLoading ? (
                <Text color="gray.500" mb={4} mt="9px" alignSelf="flex-end">
                  Pagination is loading...
                </Text>
              ) : (
                <Pagination
                  size="xs"
                  currentPage={page}
                  total={tickets?.totalDocs}
                  paginationProps={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: '5  px',
                  }}
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
              )}
            </Flex>

            <PageContentScroll>
              <Stack spacing={5} px={3}>
                {isFetching ? (
                  <SkeletonPlaceHolder count={8} />
                ) : (
                  tickets?.docs.map((ticket) => (
                    <SimpleGrid
                      key={ticket._id}
                      border="1px"
                      w="full"
                      borderColor={borderLine}
                      bgColor={ticket._id === selectedRow ? '#011627' : 'none'}
                    >
                      <HStack w="full" p={2}>
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                          w="full"
                        >
                          <Text
                            mx={2}
                            fontSize="sm"
                            fontWeight="light"
                            color="gray.500"
                          >
                            {ticket.user?.email}
                          </Text>

                          {ticket.seen === false && (
                            <Tag
                              size="sm"
                              borderRadius="full"
                              variant="solid"
                              colorScheme="green"
                            />
                          )}
                        </Flex>
                      </HStack>

                      <HStack p={2}>
                        <Stack p={2}>
                          <Text fontSize="20px">{`# ${ticket.ticketNumber}`}</Text>
                        </Stack>
                        <Flex direction="column">
                          <Text fontWeight="bold" color="accent">
                            {ticket.requestDetails
                              ? ticket.requestDetails.requester.department?.name
                              : ticket.createdBy.firstName}
                          </Text>
                          <Text
                            fontWeight="light"
                            fontSize="sm"
                            color="gray.500"
                          >
                            {`Category: ${ticket?.category.name}`}
                          </Text>
                        </Flex>
                      </HStack>

                      <HStack
                        style={{ position: 'relative' }}
                        borderTop="1px"
                        borderColor={borderLine}
                        borderStyle="dashed"
                        p={2}
                        justifyContent="space-between"
                        maxH="42px"
                        minH="42px"
                      >
                        <HStack color="gray.500" className="ticket__card">
                          <Icon as={FaClock} />
                          <Tooltip label="2 days left">
                            <Text fontSize="xs" fontWeight="light">
                              {moment(ticket.targetDate).format(
                                'ddd, MMM D YYYY, h:mm:ss a'
                              )}
                            </Text>
                          </Tooltip>
                        </HStack>

                        <HStack>
                          <Text
                            fontSize="xs"
                            fontWeight="light"
                            color="primary"
                            cursor="pointer"
                            onClick={() => selectTicketHandler(ticket)}
                          >
                            View Details
                          </Text>
                        </HStack>
                      </HStack>
                    </SimpleGrid>
                  ))
                )}
              </Stack>

              {tickets?.docs.length === 0 && (
                <HStack pl={5}>
                  <Text color="accent">No tickets found...</Text>
                </HStack>
              )}
            </PageContentScroll>
          </Flex>

          <Flex
            w="full"
            width="70%"
            pt="48px"
            px={3}
            display={{ base: 'none', md: 'none', lg: 'inline-block' }}
          >
            {loadingToSeen ? (
              <Spinner color="accent" size="md" />
            ) : (
              selectedTicket && (
                <SelectedTicket
                  selectedTicket={selectedTicket}
                  OPEN_DONE_MODAL={doneModal.onOpen}
                  OPEN_DIALOG={CLOSING_TICKET_DIALOG.onOpen}
                  OPEN_CANCELL_MODAL={CANCELLING_TICKET_DIALOG.onOpen}
                  PRINT_HM={PRINT_MODAL_HM.onOpen}
                  PRINT_SI={PRINT_MODAL_SI.onOpen}
                  PRINT_SS={PRINT_MODAL_SS.onOpen}
                  RE_PRINT_HM={RE_PRINT_HM.onOpen}
                  RE_PRINT_SI={RE_PRINT_SI.onOpen}
                  RE_PRINT_SS={RE_PRINT_SS.onOpen}
                />
              )
            )}
          </Flex>
        </Flex>
      </Flex>

      {doneModal.isOpen && (
        <ModalDoneTicket
          selectedTicket={selectedTicket}
          isOpen={doneModal.isOpen}
          onClose={doneModal.onClose}
        />
      )}

      {CLOSING_TICKET_DIALOG.isOpen && (
        <Dialog
          isOpen={CLOSING_TICKET_DIALOG.isOpen}
          onClose={CLOSING_TICKET_DIALOG.onClose}
          title=""
          onSubmit={closeTicketHandler}
        >
          <VStack alignItems="flex-start">
            <HStack>
              <Text>Do you want to close ticket</Text>
              <Text color="primary">{`# ${selectedTicket?.ticketNumber} ?`}</Text>
            </HStack>
            <Text
              color="primary"
              cursor="pointer"
              as="u"
              onClick={() => alert('next update')}
            >
              Re-open
            </Text>
          </VStack>
        </Dialog>
      )}

      {CANCELLING_TICKET_DIALOG.isOpen && (
        <Dialog
          isOpen={CANCELLING_TICKET_DIALOG.isOpen}
          onClose={CANCELLING_TICKET_DIALOG.onClose}
          title=""
          onSubmit={cancelTicketHandler}
        >
          <HStack>
            <Text>Do you want to cancel ticket</Text>
            <Text color="primary">{`#${selectedTicket?.ticketNumber} ?`}</Text>
          </HStack>
        </Dialog>
      )}

      {PRINT_MODAL_HM.isOpen && (
        <PrintPageHM
          data={selectedTicket}
          componentRef={componentRef}
          isOpen={PRINT_MODAL_HM.isOpen}
          onClose={PRINT_MODAL_HM.onClose}
        />
      )}

      {PRINT_MODAL_SI.isOpen && (
        <PrintPageSI
          data={selectedTicket}
          componentRef={componentRef}
          isOpen={PRINT_MODAL_SI.isOpen}
          onClose={PRINT_MODAL_SI.onClose}
        />
      )}

      {PRINT_MODAL_SS.isOpen && (
        <PrintPageSS
          data={selectedTicket}
          componentRef={componentRef}
          isOpen={PRINT_MODAL_SS.isOpen}
          onClose={PRINT_MODAL_SS.onClose}
        />
      )}

      {RE_PRINT_HM.isOpen && (
        <RePrint
          data={selectedTicket}
          componentRef={componentRef}
          isOpen={RE_PRINT_HM.isOpen}
          onClose={RE_PRINT_HM.onClose}
        />
      )}

      {RE_PRINT_SI.isOpen && (
        <RePrint_SI
          data={selectedTicket}
          componentRef={componentRef}
          isOpen={RE_PRINT_SI.isOpen}
          onClose={RE_PRINT_SI.onClose}
        />
      )}
    </>
  );
};

export default MainContent;
