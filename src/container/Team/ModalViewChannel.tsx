import { Badge, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ModalComponent from "../../components/Modal";
import { ITeam } from "../../models/interface";

interface Props {
  data: Array<ITeam>;
  userId: string;
  isOpen: boolean;
  onClosed: () => void;
}

const ModalViewChannel: React.FC<Props> = ({
  data,
  userId,
  isOpen,
  onClosed,
}) => {
  const [channels, setChannels] = useState<ITeam>();

  useEffect(() => {
    let selectedChannel = data.filter(({ _id }) => _id === userId);

    setChannels(selectedChannel[0]);
  }, [data, userId]);

  return (
    <ModalComponent
      title="Channels List"
      isOpen={isOpen}
      onClose={onClosed}
      size="sm"
      isCentered={false}
    >
      <Table borderColor="white" size="sm">
        <Thead>
          <Tr>
            <Th>Channel Name</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {channels?.channels.map((item) => (
            <Tr key={item._id}>
              <Td>{item.name}</Td>
              <Td>
                <Text>
                  {item.isActive ? (
                    <Badge colorScheme="green">Active</Badge>
                  ) : (
                    <Badge colorScheme="red">Deactivated</Badge>
                  )}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </ModalComponent>
  );
};
export default ModalViewChannel;
