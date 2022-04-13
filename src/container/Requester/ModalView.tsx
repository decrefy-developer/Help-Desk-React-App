import { Box, Flex, HStack, Stack, Text, VStack } from "@chakra-ui/layout";
import { Progress } from "@chakra-ui/progress";
import moment from "moment";
import { useGetTicketQuery } from "../../app/features/ticket-query";
import ModalComponent from "../../components/Modal";

interface IProps {
  rowId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ModalView: React.FC<IProps> = ({ rowId, isOpen, onClose }) => {
  const { data: ticket, isLoading } = useGetTicketQuery(rowId);

  return (
    <ModalComponent
      size="lg"
      title="Request details"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Flex pb={5}>
        {isLoading ? (
          <Box mb={5} justifyContent="center" w="full">
            <Progress size="xs" isIndeterminate colorScheme="purple" />
            <Text fontWeight="light" color="gray.500">
              please wait...
            </Text>
          </Box>
        ) : ticket ? (
          <Stack>
            <HStack>
              <Text size="sm" fontWeight="light" color="gray.500">
                Ticket #:
              </Text>
              <Text>{ticket.ticketNumber}</Text>
            </HStack>

            <HStack>
              <Text size="sm" fontWeight="light" color="gray.500">
                Subject:
              </Text>
              <Text>{ticket.category.name}</Text>
            </HStack>

            <HStack>
              <Text size="sm" fontWeight="light" color="gray.500">
                Sub-category:
              </Text>
              <Text>
                {ticket.subCategory.map((item) => item.name).join(",")}
              </Text>
            </HStack>

            <HStack>
              <Text size="sm" fontWeight="light" color="gray.500">
                Target date:
              </Text>
              <Text>
                {moment(ticket?.targetDate).format(
                  "ddd, MMM D YYYY, h:mm:ss a"
                )}
              </Text>
            </HStack>

            {ticket?.doneDate && (
              <HStack>
                <Text size="sm" fontWeight="light" color="gray.500">
                  Date accomplished:
                </Text>
                <Text>
                  {moment(ticket?.doneDate).format(
                    "ddd, MMM D YYYY, h:mm:ss a"
                  )}
                </Text>
              </HStack>
            )}

            <VStack alignItems="flex-start">
              <Text size="sm" fontWeight="light" color="gray.500">
                Concern:
              </Text>
              <Text>{ticket?.description}</Text>
            </VStack>
          </Stack>
        ) : (
          <Text color="accent">
            This ticket has not yet been started, please wait a few
            minutes/hours.{" "}
          </Text>
        )}
      </Flex>
    </ModalComponent>
  );
};

export default ModalView;
