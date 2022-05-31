import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  HStack,
  Icon,
  Stack,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { FaHashtag } from 'react-icons/fa';
import StringTruncate from '../utils/StringTruncate';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
const NotificationDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const item: any = [];

  for (let index = 0; index < 15; index++) {
    item.push(
      <Stack p={2} borderBottom="1px" borderColor="gray.500">
        <HStack>
          <Icon as={FaHashtag} />
          <Text>124</Text>
          <Text>{StringTruncate('HARDWARE MAINTENANCE', 18)}</Text>
        </HStack>
        <Text color="gray.500" fontSize="sm">
          15 hours ago
        </Text>
      </Stack>
    );
  }
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Notifactions</DrawerHeader>

        <DrawerBody p={0}>{item}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationDrawer;
