import { Badge, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ModalComponent from "../../components/Modal";
import { IChannel } from "../../models/interface";

interface IModal {
  data: Array<IChannel>;
  userId: string;
  isOpen: boolean;
  onClosed: () => void;
}

const ModalComponentViewMembers: React.FC<IModal> = ({
  data,
  userId,
  isOpen,
  onClosed,
}) => {
  const [members, setMembers] = useState<IChannel>();

  useEffect(() => {
    let selectedMember = data.filter(({ _id }) => _id === userId);

    setMembers(selectedMember[0]);
  }, [data, userId]);

  return (
    <ModalComponent
      title="Members"
      isOpen={isOpen}
      onClose={onClosed}
      size="sm"
      isCentered={false}
    >
      <Table borderColor="white" size="sm">
        <Thead>
          <Tr>
            <Th>email</Th>
            <Th>Role</Th>
          </Tr>
        </Thead>
        <Tbody>
          {members?.members.map((item) => (
            <Tr key={item._id}>
              <Td>{item.email}</Td>
              <Td>
                {item.isAdmin ? (
                  <Badge colorScheme="green">Admin</Badge>
                ) : (
                  <Badge colorScheme="yellow">Standard</Badge>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </ModalComponent>
  );
};

export default ModalComponentViewMembers;
