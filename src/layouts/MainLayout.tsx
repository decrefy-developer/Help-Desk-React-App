import { Flex } from '@chakra-ui/layout';
import React, { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AddFloatingButton } from '../components/FloatingButton';
import SideBar from '../components/SideBar';
import StyleContext from '../context/StyleContext';
import Socket from '../services/Socket';
import useNotification from '../hooks/useNotification';
import { DecodeToken } from '../utils/decode-token';
import { IUser } from '../models/interface';

const MainLayout: React.FC = () => {
  const { openTicketDrawer } = useContext(StyleContext);
  const decode: IUser | null = DecodeToken();
  const { notify, requestPermission } = useNotification();

  useEffect(() => {
    requestPermission();
    Socket.on('received-ticket', (data) => {
      notify(data.ticketNumber, `home/${data.channelId}`);
    });
  }, []);

  useEffect(() => {
    if (decode?._id !== '') Socket.emit('join', decode?._id);
  }, [decode]);

  return (
    <Flex w="full" h="100vh">
      <SideBar />
      <Outlet />
      {decode?.priviledge.includes('CREATE TICKET') && (
        <AddFloatingButton openDrawer={openTicketDrawer} />
      )}
    </Flex>
  );
};

export default MainLayout;
