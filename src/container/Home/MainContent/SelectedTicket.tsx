import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Input,
  PinInput,
  PinInputField,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import moment from 'moment';
import React, { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetRoleInChannelQuery } from '../../../app/features/member-query';
import { useUpdateTargetDateMutation } from '../../../app/features/ticket-query';
import ModalComponent from '../../../components/Modal';
import PopOver from '../../../components/PopOver';
import {
  ACCESS,
  ITicket,
  IUser,
  STATE,
  STATUS,
} from '../../../models/interface';
import { DecodeToken } from '../../../utils/decode-token';
import ModalTransfer from './ModalTransfer';

interface IProps {
  selectedTicket: ITicket;
  OPEN_DONE_MODAL: () => void;
  OPEN_DIALOG: () => void;
  OPEN_CANCELL_MODAL: () => void;
  PRINT_HM: () => void;
  PRINT_SI: () => void;
  PRINT_SS: () => void;
  RE_PRINT_HM: () => void;
  RE_PRINT_SI: () => void;
  RE_PRINT_SS: () => void;
}

const SelectedTicket: React.FC<IProps> = ({
  selectedTicket,
  OPEN_DONE_MODAL,
  OPEN_DIALOG,
  OPEN_CANCELL_MODAL,
  PRINT_HM,
  PRINT_SI,
  PRINT_SS,
  RE_PRINT_HM,
  RE_PRINT_SI,
  RE_PRINT_SS,
}) => {
  const dateNow = moment().format('YYYY-MM-DD'); // this is just to disables previews date
  const bgColor = useColorModeValue('gray.400', '#011627');
  const decoded: IUser | null = DecodeToken();
  const { channelId } = useParams();
  const [date, setDate] = useState('');
  const passCodeModal = useDisclosure();
  const updatePasscodeModal = useDisclosure();
  const transferTicketModal = useDisclosure();
  // state for Errors
  const [errorPasscode, setErrorPasscode] = useState('');
  const [errorDate, setErrorDate] = useState('');

  const { data: role } = useGetRoleInChannelQuery({
    userId: decoded ? decoded._id : '',
    channelId: channelId ? channelId : '',
  });

  const [updateTargetDate] = useUpdateTargetDateMutation();

  function EnterPasscode(value: string) {
    if (value === '2022') {
      updatePasscodeModal.onOpen();
      passCodeModal.onClose();
    } else {
      setErrorPasscode('Wrong passcode!');
    }
  }

  async function SubmitHandler() {
    try {
      if (!date) return setErrorDate('Date is required');

      if (date < dateNow) return setErrorDate('it should not be lower today');

      const result = await updateTargetDate({
        _id: selectedTicket._id,
        targetDate: date,
      }).unwrap();

      if (result) {
        setErrorDate('');
        toast.success(`target date has been successfully changed`);
        updatePasscodeModal.onClose();
      }
    } catch (error: any) {
      toast.error(error.data.message);
    }
  }

  function putComments() {
    alert('will be availbale in next update');
  }

  function transferTicket(_id: string) {
    transferTicketModal.onOpen();
  }

  return (
    <>
      <Flex flexDirection="column" pl={8} w="full">
        <Box bgColor={bgColor} p={4}>
          <HStack w="full" justifyContent="space-between">
            <HStack>
              <Text size="sm" fontWeight="light" color="gray.500">
                Ticket :
              </Text>
              <Text fontWeight="bold">{`# ${selectedTicket?.ticketNumber}`}</Text>
            </HStack>

            <Text>
              {moment(selectedTicket?.createdAt).format('ddd, MMM D YYYY')}
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
              {selectedTicket?.subCategory.map((item) => item.name).join(', ')}
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
                  .join(' , ')}]`}
            </Text>
          </HStack>

          <HStack w="full" mt={2}>
            <Text size="sm" fontWeight="light" color="gray.500">
              tags :
            </Text>
            <Text fontWeight="light" color="secondAccent">
              {selectedTicket.tags.join(', ')}
            </Text>
          </HStack>

          <HStack mt={7}>
            <Text size="sm" fontWeight="light" color="gray.500">
              Target Date:
            </Text>
            <Text>
              {moment(selectedTicket?.targetDate).format('ddd, MMM D YYYY')}
            </Text>

            {decoded?.priviledge.includes(ACCESS.CREATE_TICKET) &&
              selectedTicket.state === STATE.PENDING && (
                <Icon
                  as={FaEdit}
                  cursor="pointer"
                  onClick={passCodeModal.onOpen}
                />
              )}
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
                color={selectedTicket?.state === 'DONE' ? 'success' : 'warning'}
              >
                {selectedTicket?.state}
              </Text>
            </Tooltip>
            <Text>
              {selectedTicket?.doneDate &&
                moment(selectedTicket?.doneDate).format('ddd, MMM D YYYY')}
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
                    ? 'warning'
                    : selectedTicket.status === STATUS.CLOSED
                    ? 'success'
                    : 'danger'
                }
              >
                {selectedTicket?.status}
              </Text>
            </Tooltip>
            <Text>
              {selectedTicket?.status === STATUS.CLOSED &&
                moment(selectedTicket?.closeDate).format('ddd, MMM D YYYY')}
            </Text>
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
              <Button
                mr="-1px"
                onClick={() => transferTicket(selectedTicket._id)}
              >
                Transfer
              </Button>
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
                print_HM={PRINT_HM}
                print_SI={PRINT_SI}
                print_PM={() => {}}
                print_SS={PRINT_SS}
              />
            )}

            {selectedTicket.status === STATUS.CLOSED &&
              selectedTicket.state === STATE.DONE && (
                <PopOver
                  buttonTitle="re-print"
                  headerTitle="Re-print the SR with solution"
                  print_HM={RE_PRINT_HM}
                  print_SI={RE_PRINT_SI}
                  print_PM={() => {}}
                  print_SS={() => {}}
                />
              )}

            {selectedTicket.state !== STATE.PENDING && (
              <PopOver
                buttonTitle="print"
                headerTitle=" Printing SR with completed details"
                print_HM={PRINT_HM}
                print_SI={PRINT_SI}
                print_PM={() => {}}
                print_SS={PRINT_SS}
              />
            )}

            <Button mr="-1px" onClick={putComments}>
              Comments
            </Button>
          </ButtonGroup>
        </Box>
      </Flex>

      {passCodeModal.isOpen && (
        <ModalComponent
          title="Enter Passcode"
          isOpen={passCodeModal.isOpen}
          size="sm"
          isCentered={true}
          onClose={passCodeModal.onClose}
        >
          <HStack w="full" justifyContent="center" mb={5}>
            <PinInput
              mask
              size="lg"
              onComplete={(value) => EnterPasscode(value)}
            >
              <PinInputField autoFocus={true} />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
          <Flex w="full" justifyContent="center">
            <Text color="danger">{errorPasscode}</Text>
          </Flex>
        </ModalComponent>
      )}

      {updatePasscodeModal.isOpen && (
        <ModalComponent
          title="Updating..."
          isOpen={updatePasscodeModal.isOpen}
          size="sm"
          isCentered={true}
          onClose={updatePasscodeModal.onClose}
          click
          closeOnOverlayClick={false}
        >
          <Flex mb={5}>
            <FormControl isInvalid={errorDate ? true : false}>
              <FormLabel htmlFor="coworkers" fontSize="sm" color="gray.400">
                Select target date
              </FormLabel>
              <Input
                id="startDate"
                type="datetime-local"
                min={dateNow}
                onChange={(e) => setDate(e.target.value)}
              />
              <FormErrorMessage justifyContent="flex-end">
                {errorDate}
              </FormErrorMessage>
            </FormControl>
            <Button onClick={SubmitHandler} alignSelf="flex-end">
              submit
            </Button>
          </Flex>
        </ModalComponent>
      )}

      {transferTicketModal.isOpen && (
        <ModalTransfer
          data={selectedTicket}
          isOpen={transferTicketModal.isOpen}
          onClose={transferTicketModal.onClose}
        />
      )}
    </>
  );
};

export default SelectedTicket;
