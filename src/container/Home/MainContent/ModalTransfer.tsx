import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useListTeamQuery } from '../../../app/features/team-query';
import { useCreateTransferRequestMutation } from '../../../app/features/transfer-query';
import ModalComponent from '../../../components/Modal';
import { ITicket } from '../../../models/interface';

interface Props {
  data: ITicket;
  onClose: () => void;
  isOpen: boolean;
}

const ModalTransfer: React.FC<Props> = ({ data, isOpen, onClose }) => {
  const [errorTeam, setErrorTeam] = useState<string>('');
  const [errorRemarks] = useState<string>('');
  const [team, setTeam] = useState<string>();
  const [remarks, setRemarks] = useState<string>('');

  const { data: teamQuery, isFetching } = useListTeamQuery({
    page: 1,
    limit: 10000,
    search: '',
    status: true,
  });

  const [createTransferRequest] = useCreateTransferRequestMutation();

  async function submitHandler() {
    try {
      if (!team) return setErrorTeam('Team is required');
      setErrorTeam('');

      const formSubmit = {
        ticketId: data._id,
        ticketNumber: data.ticketNumber,
        description: data.description,
        from: {
          teamId: data.team._id,
          channelId: data.channel._id,
        },
        to: {
          teamId: team,
        },
        remarks,
      };

      const result = await createTransferRequest(formSubmit).unwrap();

      if (result) {
        toast.success(`request has been successfully sent`);
        onClose();
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  }

  return (
    <ModalComponent
      title="Transfer Ticket"
      isOpen={isOpen}
      size="sm"
      isCentered={true}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <Stack gap={3} mb={3}>
        <FormControl isInvalid={errorTeam ? true : false}>
          <HStack justifyContent="space-between" alignItems="center">
            <FormLabel htmlFor="teamId" fontSize="sm" color="gray.400">
              Team
            </FormLabel>
          </HStack>

          <Select
            id="teamId"
            isLoading={isFetching}
            onChange={(e) => setTeam(e?.value)}
            selectedOptionStyle="color"
            placeholder="Select Team"
            options={teamQuery?.docs.map(function (team) {
              return { value: team._id, label: team.name };
            })}
            selectedOptionColor="purple"
            isClearable={true}
          />
          <FormErrorMessage justifyContent="flex-end">
            {setErrorTeam}
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={errorRemarks ? true : false}>
          <HStack justifyContent="space-between" alignItems="center">
            <FormLabel htmlFor="remarks" fontSize="sm" color="gray.400">
              Remarks
            </FormLabel>
          </HStack>

          <Textarea
            id="remarks"
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Remarks here (optional)"
            size="sm"
          />
          <FormErrorMessage justifyContent="flex-end">
            {errorRemarks}
          </FormErrorMessage>
        </FormControl>

        <Button bgColor="primary" size="sm" onClick={submitHandler}>
          Submit
        </Button>
      </Stack>
    </ModalComponent>
  );
};

export default ModalTransfer;
