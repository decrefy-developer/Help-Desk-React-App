import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { useParams } from "react-router-dom";
import { useGetRoleInChannelQuery } from "../../../app/features/member-query";
import PopOver from "../../../components/PopOver";
import {
  ACCESS,
  ITicket,
  IUser,
  STATE,
  STATUS,
} from "../../../models/interface";
import { DecodeToken } from "../../../utils/decode-token";

interface IProps {
  selectedTicket: ITicket;
  OPEN_DONE_MODAL: () => void;
  OPEN_DIALOG: () => void;
  OPEN_CANCELL_MODAL: () => void;
  IS_HM_MODAL_OPEN: boolean;
  CLOSE_HM_MODAL: () => void;
  OPEN_HM_MODAL: () => void;
}

const SelectedTicket: React.FC<IProps> = ({
  selectedTicket,
  OPEN_DONE_MODAL,
  OPEN_DIALOG,
  OPEN_CANCELL_MODAL,
  IS_HM_MODAL_OPEN,
  CLOSE_HM_MODAL,
  OPEN_HM_MODAL,
}) => {
  const bgColor = useColorModeValue("gray.400", "#011627");
  const decoded: IUser | null = DecodeToken();
  const { channelId } = useParams();

  const { data: role } = useGetRoleInChannelQuery({
    userId: decoded ? decoded._id : "",
    channelId: channelId ? channelId : "",
  });

  return (
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
            {moment(selectedTicket?.createdAt).format("ddd, MMM D YYYY")}
          </Text>
        </HStack>

        {selectedTicket?.requestDetails ? (
          <Stack>
            <HStack w="full" mt={2}>
              <Text size="sm" fontWeight="light" color="gray.500">
                Request ID:
              </Text>
              <Text fontWeight="light" fontSize="sm">
                {selectedTicket?.requestDetails?._id}
              </Text>
            </HStack>

            <HStack w="full" mt={2}>
              <Text size="sm" fontWeight="light" color="gray.500">
                Department:
              </Text>
              <Text fontWeight="light">
                {selectedTicket.requestDetails.requester.department.name}
              </Text>
            </HStack>

            <HStack w="full" mt={2}>
              <Text size="sm" fontWeight="light" color="gray.500">
                Requester:
              </Text>
              <Text fontWeight="light">
                {`${selectedTicket.requestDetails.requester.firstName.toUpperCase()} ${selectedTicket.requestDetails.requester.lastName.toUpperCase()}`}
              </Text>
            </HStack>
          </Stack>
        ) : (
          <Stack>
            <Text color="primary" fontStyle="italic">
              created by ticketer
            </Text>
            <HStack w="full" mt={2}>
              <Text size="sm" fontWeight="light" color="gray.500">
                Department:
              </Text>
              <Text fontWeight="light">{selectedTicket.department.name}</Text>
            </HStack>

            <HStack w="full" mt={2}>
              <Text size="sm" fontWeight="light" color="gray.500">
                Requester:
              </Text>
              <Text fontWeight="light">{selectedTicket.requesterName}</Text>
            </HStack>
          </Stack>
        )}

        <HStack w="full" mt={2} alignItems="center">
          <Text size="sm" fontWeight="light" color="gray.500">
            Subject:
          </Text>
          <Text>{selectedTicket?.category.name.toUpperCase()}</Text>
        </HStack>

        <HStack w="full" mt={2} alignItems="center">
          <Text size="sm" fontWeight="light" color="gray.500">
            Sub-category:
          </Text>
          <Text>
            {selectedTicket?.subCategory.map((item) => item.name).join(", ")}
          </Text>
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
            {moment(selectedTicket?.targetDate).format("ddd, MMM D YYYY")}
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
              color={selectedTicket?.state === "DONE" ? "success" : "warning"}
            >
              {selectedTicket?.state}
            </Text>
          </Tooltip>
          <Text>
            {selectedTicket?.doneDate &&
              moment(selectedTicket?.doneDate).format("ddd, MMM D YYYY")}
          </Text>
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
                selectedTicket?.status === STATUS.OPEN
                  ? "warning"
                  : selectedTicket.status === STATUS.CLOSED
                  ? "success"
                  : "danger"
              }
            >
              {selectedTicket?.status}
            </Text>
          </Tooltip>
          <Text>
            {selectedTicket?.status === STATUS.CLOSED &&
              moment(selectedTicket?.closeDate).format("ddd, MMM D YYYY")}
          </Text>
        </HStack>
        <HStack w="full" mt={2}>
          <Text fontWeight="bold">{selectedTicket.tags.join(" , ")}</Text>
        </HStack>

        <VStack w="full" mt={5} alignItems="flex-start">
          <Text size="sm" fontWeight="light" color="gray.500">
            Concern :
          </Text>
          <Text fontWeight="light">{selectedTicket?.description}</Text>
        </VStack>

        {selectedTicket?.doneDate && (
          <HStack w="full" mt={2}>
            <Text size="sm" fontWeight="light" color="gray.500">
              Solution :
            </Text>
            <Text fontWeight="light">{selectedTicket?.solution}</Text>
          </HStack>
        )}

        <ButtonGroup size="xs" isAttached variant="outline" mt={5}>
          {selectedTicket.state === STATE.PENDING && (
            <Tooltip label="Click DONE if the request is completed">
              <Button mr="-1px" onClick={OPEN_DONE_MODAL}>
                Done
              </Button>
            </Tooltip>
          )}

          {(decoded?.priviledge.includes(ACCESS.CREATE_TICKET) ||
            role?.isAdmin) &&
            selectedTicket.state === STATE.DONE &&
            selectedTicket.status === STATUS.OPEN && (
              <Tooltip label="Click CLOSE if the ticket is actually resolved">
                <Button mr="-1px" onClick={OPEN_DIALOG}>
                  Close
                </Button>
              </Tooltip>
            )}
          {selectedTicket.state === STATE.PENDING && (
            <Button mr="-1px">Transfer</Button>
          )}

          {selectedTicket.state === STATE.PENDING && (
            <Button mr="-1px" onClick={OPEN_CANCELL_MODAL}>
              Cancel
            </Button>
          )}

          {selectedTicket.state === STATE.PENDING && (
            <PopOver
              buttonTitle="pre-print"
              headerTitle="Printing SR that hasn't yet resolved"
              print_HM={OPEN_HM_MODAL}
              print_SI={() => {}}
              print_PM={() => {}}
              print_SS={() => {}}
            />
          )}

          {selectedTicket.status === STATUS.CLOSED &&
            selectedTicket.state === STATE.DONE && (
              <PopOver
                buttonTitle="re-print"
                headerTitle="Re-print the SR with solution"
                print_HM={OPEN_HM_MODAL}
                print_SI={() => {}}
                print_PM={() => {}}
                print_SS={() => {}}
              />
            )}

          {selectedTicket.state !== STATE.PENDING && (
            <PopOver
              buttonTitle="print"
              headerTitle=" Printing SR with completed details"
              print_HM={OPEN_HM_MODAL}
              print_SI={() => {}}
              print_PM={() => {}}
              print_SS={() => {}}
            />
          )}

          <Button mr="-1px">Comments</Button>
        </ButtonGroup>
      </Box>
    </Flex>
  );
};

export default SelectedTicket;
