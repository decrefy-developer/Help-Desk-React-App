import { Flex } from '@chakra-ui/layout';
import React from 'react';
import { Outlet } from 'react-router-dom';

const LoginLayout: React.FC = () => {
  return (
    <Flex w="full" h="100vh">
      <Outlet />
    </Flex>
  );
};

export default LoginLayout;
