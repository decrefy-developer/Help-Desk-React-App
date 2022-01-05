import { Flex } from "@chakra-ui/layout";
import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";

const MainLayout: React.FC = () => {
  return (
    <Flex w="full" h="100vh">
      <SideBar />
      <Outlet />
    </Flex>
  );
};

export default MainLayout;
