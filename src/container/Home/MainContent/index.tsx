import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Stack,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Pagination from "@choc-ui/paginator";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Dialog from "../../../components/AlertDialog";
import PageContentScroll from "../../../components/PageContentScroll";
import SkeletonPlaceHolder from "../../../components/SkeletonPlaceHolder";
import StyleContext from "../../../context/StyleContext";
import {
  useCancelTicketMutation,
  useCloseTicketMutation,
  useDoneTicketMutation,
  useListTicketsQuery,
  useSeenTheTicketMutation,
} from "../../../app/features/ticket-query";
import useTableControl from "../../../hooks/useTableControl";
import { ITicket, STATE, STATUS } from "../../../models/interface";
import HeadingComponent from "./HeadingComponent";
import ModalMember from "./ModalMember";
import TopNavComponent from "./TopNavComponent";

const MainContent = () => {
  const { channelId } = useParams();
  const { borderLine } = useContext(StyleContext);
  const [selectedTicket, setSelectedTicket] = useState<ITicket>();
  const [selectedRow, setSelectedRow] = useState<string>("");
  const [state, setState] = useState(STATE.PENDING);
  const [status, setStatus] = useState(STATUS.OPEN);
  const [textSearch, setTextSearch] = useState<string>("");
  const bgColor = useColorModeValue("gray.400", "#011627");
  const [screenSize, getDimension] = useState({
    dynamicHeight: window.innerHeight * 0.6,
  });
  const {
    isOpen: isMemberModalOpen,
    onOpen: openMemberModal,
    onClose: closeModalMember,
  } = useDisclosure();
  const {
    isOpen: isDiaglogOpen,
    onClose: closeDialog,
    onOpen: openDialog,
  } = useDisclosure(); // compeleting ticket dialog
  const {
    isOpen: isDiaglogOpen2,
    onClose: closeDialog2,
    onOpen: openDialog2,
  } = useDisclosure(); // closing ticket dialog
  const {
    isOpen: isDiaglogOpen3,
    onClose: closeDialog3,
    onOpen: openDialog3,
  } = useDisclosure(); // cancelling ticket dialog
  const { onChangePage, onChangeLimit, page, pageLimit } = useTableControl();

  const [doneTicket] = useDoneTicketMutation();
  const [closeTicket] = useCloseTicketMutation();
  const [cancelTicket] = useCancelTicketMutation();
  const [seenTheTicket, { isLoading: loadingToSeen }] =
    useSeenTheTicketMutation();

  const {
    data: tickets,
    isFetching,
    isError,
    isLoading,
  } = useListTicketsQuery({
    page: 1,
    limit: 10,
    search: textSearch,
    channelId: channelId ? channelId : "",
    statusTicket: status,
    state: state,
  });

  const setDimension = () => {
    getDimension({ dynamicHeight: window.innerHeight * 0.6 });
  };

  const selectStateHandler = (value: STATE) => {
    setState(value);
    setStatus(STATUS.OPEN);
    setSelectedTicket(undefined);
  };

  const selectStatusHandler = (value: STATUS) => {
    setStatus(value);
    setSelectedTicket(undefined);
  };

  const selectTicketHandler = async (data: ITicket) => {
    try {
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

  const doneTicketHandler = async () => {
    try {
      if (selectedTicket?._id) {
        const result = await doneTicket({
          _id: selectedTicket?._id,
          mode: "DONE TICKET",
        }).unwrap();

        if (result) {
          toast.success(`# ${result.ticketNumber} has been completed`);
          setSelectedTicket(undefined);
          closeDialog();
        }
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  const closeTicketHandler = async () => {
    try {
      console.log("hello");
      if (selectedTicket?._id) {
        const result = await closeTicket({
          _id: selectedTicket._id,
          mode: "CLOSING TICKET",
        }).unwrap();

        if (result) {
          toast.success(`# ${result.tickNumber} has been closed successfully`);
          setSelectedTicket(undefined);
          closeDialog2();
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
          mode: "CANCELLING TICKET",
        }).unwrap();

        if (result) {
          toast.success(
            `# ${result.ticketNumber} has been cancelled succesfully`
          );
          setSelectedTicket(undefined);
          closeDialog3();
        }
      }
      console.log("submit");
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", setDimension);

    return () => {
      window.removeEventListener("resize", setDimension);
    };
  }, [screenSize]);

  return (
    <>
      <HeadingComponent openModal={openMemberModal} />
      {isMemberModalOpen && (
        <ModalMember isOpen={isMemberModalOpen} onClose={closeModalMember} />
      )}

      <TopNavComponent
        setTextSearch={setTextSearch}
        setStatus={selectStatusHandler}
        setState={selectStateHandler}
        status={status}
        state={state}
      />

      <Flex w="full" px={8} flexDirection={{ base: "column", md: "row" }}>
        <Flex w={{ base: "100%", md: "45%" }} pr={5} direction="column">
          <PageContentScroll
            maxHeight={`${Math.round(screenSize.dynamicHeight)}px`}
            pr="10px"
          >
            <Stack spacing={5}>
              {isFetching ? (
                <SkeletonPlaceHolder count={5} />
              ) : (
                tickets?.docs.map((ticket) => (
                  <SimpleGrid
                    key={ticket._id}
                    border="1px"
                    w="full"
                    borderColor={borderLine}
                    bgColor={ticket._id === selectedRow ? "#011627" : "none"}
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
                          {ticket.user.email}
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
                          {/* {ticket.customer.name} */}
                        </Text>
                        <Text fontWeight="light" fontSize="sm" color="gray.500">
                          {`Category: ${ticket.category.name}`}
                        </Text>
                      </Flex>
                    </HStack>

                    <HStack
                      borderTop="1px"
                      borderColor={borderLine}
                      borderStyle="dashed"
                      p={2}
                      justifyContent="space-between"
                    >
                      <HStack color="gray.500">
                        <Icon as={FaClock} />
                        <Tooltip label="2 days left">
                          <Text fontSize="xs" fontWeight="light">
                            {moment(ticket.targetDate).format(
                              "ddd, MMM D YYYY, h:mm:ss a"
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
                display: "flex",
                justifyContent: "flex-end",
                mt: "9px",
              }}
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
          )}
        </Flex>

        {loadingToSeen ? (
          <Spinner color="accent" size="md" />
        ) : (
          selectedTicket && (
            <Flex w={{ base: "100%", md: "55%" }} flexDirection="column">
              <Box bgColor={bgColor} p={4}>
                <HStack w="full" justifyContent="space-between">
                  <HStack>
                    <Text size="sm" fontWeight="light" color="gray.500">
                      Ticket :
                    </Text>
                    <Text fontWeight="bold">{`# ${selectedTicket?.ticketNumber}`}</Text>
                  </HStack>

                  <Text>
                    {moment(selectedTicket?.createdAt).format(
                      "ddd, MMM D YYYY"
                    )}
                  </Text>
                </HStack>

                <HStack w="full" mt={5}>
                  <Text size="sm" fontWeight="light" color="gray.500">
                    Customer:
                  </Text>
                  <Text fontWeight="bold">
                    {/* {selectedTicket?.customer.name.toUpperCase()} */}
                  </Text>
                </HStack>

                <HStack w="full" mt={2}>
                  <Text size="sm" fontWeight="light" color="gray.500">
                    Subject:
                  </Text>
                  <Text>{selectedTicket?.category.name.toUpperCase()}</Text>
                </HStack>

                <HStack w="full" mt={2}>
                  <Text size="sm" fontWeight="light" color="gray.500">
                    to :
                  </Text>
                  <Text fontWeight="light" color="secondAccent">
                    {selectedTicket?.user.email}
                    {selectedTicket.coworkers.length > 0 &&
                      `  [ ${selectedTicket.coworkers
                        .map((worker) => worker.email)
                        .join(" , ")}]`}
                  </Text>
                </HStack>

                <HStack mt={7}>
                  <Text size="sm" fontWeight="light" color="gray.500">
                    Target Date:
                  </Text>
                  <Text>
                    {moment(selectedTicket?.targetDate).format(
                      "ddd, MMM D YYYY"
                    )}
                  </Text>
                </HStack>
                <HStack w="full" mt={2}>
                  <Text size="sm" fontWeight="light" color="gray.500">
                    State :
                  </Text>
                  <Tooltip
                    label={
                      <>
                        <Text color="warning">PENDING</Text>
                        <Text color="success">DONE</Text>
                      </>
                    }
                    placement="right-start"
                    bg="gray.700"
                  >
                    <Text
                      color={
                        selectedTicket?.state === "DONE" ? "success" : "warning"
                      }
                    >
                      {selectedTicket?.state}
                    </Text>
                  </Tooltip>
                </HStack>
                <HStack w="full" mt={2}>
                  <Text size="sm" fontWeight="light" color="gray.500">
                    Status :
                  </Text>
                  <Tooltip
                    label={
                      <>
                        <Text color="warning">OPEN</Text>
                        <Text color="success">CLOSED</Text>
                        <Text color="danger">CANCELLED</Text>
                      </>
                    }
                    placement="right-start"
                    bg="gray.700"
                  >
                    <Text
                      color={
                        selectedTicket?.status === "OPEN"
                          ? "warning"
                          : selectedTicket.status === "CLOSED"
                            ? "success"
                            : "danger"
                      }
                    >
                      {selectedTicket?.status}
                    </Text>
                  </Tooltip>
                </HStack>
                <HStack w="full" mt={2}>
                  <Text size="sm" fontWeight="light" color="gray.500">
                    Tags :
                  </Text>

                  <Text fontWeight="bold">
                    {selectedTicket.tags.join(" , ")}
                  </Text>
                </HStack>

                <HStack w="full" mt={5}>
                  <Text fontWeight="light">{selectedTicket?.description}</Text>
                </HStack>

                <ButtonGroup size="sm" isAttached variant="outline" mt={5}>
                  {selectedTicket.state === STATE.PENDING && (
                    <Button mr="-px" onClick={openDialog}>
                      Done
                    </Button>
                  )}
                  {selectedTicket.state === STATE.DONE &&
                    selectedTicket.status !== STATUS.CLOSED && (
                      <Button mr="-px" onClick={openDialog2}>
                        Close
                      </Button>
                    )}
                  {selectedTicket.state === STATE.PENDING && (
                    <Button mr="-px">Transfer</Button>
                  )}
                  {selectedTicket.state === STATE.PENDING && (
                    <Button mr="-px" onClick={openDialog3}>
                      Cancel
                    </Button>
                  )}
                  <Button mr="-px">Comments</Button>
                </ButtonGroup>
              </Box>
            </Flex>
          )
        )}
      </Flex>

      {isDiaglogOpen && (
        <Dialog
          isOpen={isDiaglogOpen}
          onClose={closeDialog}
          title=""
          onSubmit={doneTicketHandler}
        >
          <HStack>
            <Text>Do you want to complete ticket</Text>
            <Text color="primary">{`# ${selectedTicket?.ticketNumber} ?`}</Text>
          </HStack>
        </Dialog>
      )}

      {isDiaglogOpen2 && (
        <Dialog
          isOpen={isDiaglogOpen2}
          onClose={closeDialog2}
          title=""
          onSubmit={closeTicketHandler}
        >
          <HStack>
            <Text>Do you want to close ticket</Text>
            <Text color="primary">{`# ${selectedTicket?.ticketNumber} ?`}</Text>
          </HStack>
        </Dialog>
      )}

      {isDiaglogOpen3 && (
        <Dialog
          isOpen={isDiaglogOpen3}
          onClose={closeDialog3}
          title=""
          onSubmit={cancelTicketHandler}
        >
          <HStack>
            <Text>Do you want to cancel ticket</Text>
            <Text color="primary">{`#${selectedTicket?.ticketNumber} ?`}</Text>
          </HStack>
        </Dialog>
      )}
    </>
  );
};

export default MainContent;
