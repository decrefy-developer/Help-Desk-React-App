import {
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import ModalComponent from "../../components/Modal";
import { useChannelsOfTheUserQuery } from "../../app/features/member-query";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const ModalViewChannel: React.FC<Props> = ({ isOpen, onClose, userId }) => {
  const { data, isFetching } = useChannelsOfTheUserQuery(userId);

  return (
    <ModalComponent
      title="Teams & Channels"
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      isCentered={false}
    >
      {isFetching ? (
        <Stack w="full" py={10}>
          6
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : data && data?.length <= 0 ? (
        <Text color="danger" as="em">
          No teams and channels found.
        </Text>
      ) : (
        <Table borderColor="white" size="sm">
          <Thead>
            <Tr>
              <Th>Teams</Th>
              <Th>Channels Group</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.map((item) => (
              <Tr key={item._id}>
                <Td>{item.team}</Td>
                <Td>
                  [ {item.channels.flatMap((channel) => `${channel.name} , `)} ]
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </ModalComponent>
  );
};

export default ModalViewChannel;
