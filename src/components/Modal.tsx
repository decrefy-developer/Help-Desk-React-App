import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  size?: string;
  isCentered?: boolean;
}

const ModalComponent: React.FC<ModalProps> = ({
  title,
  isOpen,
  onClose,
  children,
  size,
  isCentered,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={size}
      isCentered={isCentered}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalComponent;
