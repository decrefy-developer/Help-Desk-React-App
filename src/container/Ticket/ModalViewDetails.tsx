import { Box, HStack, Stack, Text } from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import ModalComponent from '../../components/Modal';
import { ITicket } from '../../models/interface';

interface Props {
  modal: any;
  data: ITicket | undefined;
}

const ModalViewDetails: React.FC<Props> = ({ modal, data }) => {
  console.log('selected', data);
  return (
    <ModalComponent
      title="Ticket Details"
      isOpen={modal.isOpen}
      onClose={modal.onClose}
      size="lg"
    >
      <Stack mb={5}>
        <HStack>
          <Text color="gray.500">Ticket: </Text>
          <Text fontWeight="bold"> {`# ${data?.ticketNumber}`} </Text>
        </HStack>

        <HStack>
          <Text color="gray.500">Date Created: </Text>
          <Text> {moment(data?.createdAt).format('MMM D YYYY, ddd')} </Text>
        </HStack>

        <HStack>
          <Text color="gray.500">Created By: </Text>
          <Text>
            {`${data?.createdBy.firstName} ${data?.createdBy.lastName}`}
          </Text>
        </HStack>

        <Box>
          <Text color="primary" mt={5}>
            Request Details
          </Text>
        </Box>

        {data?.requestDetails ? (
          <HStack>
            <Text color="gray.500">Requester: </Text>
            <Text>{`${data?.requestDetails.requester.firstName} ${data?.requestDetails.requester.lastName}`}</Text>
          </HStack>
        ) : (
          <HStack>
            <Text color="gray.500">Requester: </Text>
            <Text>{data?.requesterName}</Text>
          </HStack>
        )}

        {data?.requestDetails ? (
          <HStack>
            <Text color="gray.500">Deparment / Unit: </Text>
            <Text>{data?.requestDetails.requester.department.name}</Text>
          </HStack>
        ) : (
          <HStack>
            <Text color="gray.500">Deparment / Unit: </Text>
            <Text>{data?.department.name}</Text>
          </HStack>
        )}

        <HStack>
          <Text color="gray.500">Concern: </Text>
          <Text>{data?.description}</Text>
        </HStack>

        <Box>
          <Text color="primary" mt={5}>
            Other Details
          </Text>
        </Box>

        <HStack>
          <Text color="gray.500">Assigned to: </Text>
          <Text>{`${data?.user.firstName} ${data?.user.lastName}`}</Text>
        </HStack>

        <HStack>
          <Text color="gray.500">Subject: </Text>
          <Text>{data?.category.name}</Text>
        </HStack>

        <HStack>
          <Text color="gray.500">Sub-category: </Text>
          <Text>{data?.subCategory.map((item) => item.name).join(',')}</Text>
        </HStack>

        <HStack>
          <Text color="gray.500">Date Started: </Text>
          <Text>{moment(data?.createdAt).format('MMM DD YYYY, ddd')}</Text>
        </HStack>

        <HStack>
          <Text color="gray.500">Target Date: </Text>
          <Text>{moment(data?.targetDate).format('MMM DD YYYY, ddd')}</Text>
        </HStack>

        <HStack>
          <Text color="gray.500">Date Completed: </Text>
          <Text>{moment(data?.doneDate).format('MMM D YYYY, ddd')}</Text>
        </HStack>

        <HStack>
          <Text color="gray.500">Solution: </Text>
          <Text>{data?.solution}</Text>
        </HStack>

        <HStack>
          <Text color="gray.500">Date Closed: </Text>
          <Text>{moment(data?.closeDate).format('MMM D YYYY, ddd')}</Text>
        </HStack>
      </Stack>
    </ModalComponent>
  );
};

export default ModalViewDetails;
