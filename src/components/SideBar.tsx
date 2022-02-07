import React, { useContext } from "react";
import { Flex, Spacer, VStack } from "@chakra-ui/layout";
import { useColorMode, IconButton, Icon, Avatar } from "@chakra-ui/react";
import {
  FaHome,
  FaSun,
  FaMoon,
  FaBell,
  FaSlack,
  FaSlackHash,
  FaUserFriends,
  FaUserCog,
  FaBars,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import StyleContext from "../context/StyleContext";
import SideBarItem from "./SideBarItem";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const SideBar: React.FC = () => {
  const { pathname } = useLocation();
  const { email, priviledge } = useSelector(
    (state: RootState) => state.userSlice
  );
  const { borderLine, isSideBarShow } = useContext(StyleContext);
  const { toggleColorMode, colorMode } = useColorMode();

  let themeIcon =
    colorMode === "light" ? <FaMoon color="#a0aec0" /> : <FaSun />;
  return (
    // <SlideFade in={isSideBarShow} offsetY="50px">
    <Flex
      direction="column"
      justifyContent="space-between"
      display={isSideBarShow ? "flex" : "none"}
      borderRight="1px"
      borderRightColor={borderLine}
      p={4}
    >
      <VStack spacing={5}>
        <NavLink to="/home">
          <SideBarItem
            title="Home"
            icon={<FaHome size="20px" color="white" />}
            isActive={pathname === "/home" ? true : false}
          />
        </NavLink>

        {priviledge.includes("MEMBERS") && (
          <NavLink to="/members">
            <SideBarItem
              title="Members"
              icon={<FaUserCog size="20px" color="white" />}
              isActive={pathname === "/members" ? true : false}
            />
          </NavLink>
        )}

        {priviledge.includes("TEAMS") && (
          <NavLink to="/teams">
            <SideBarItem
              title="Teams"
              icon={<FaSlack size="20px" color="white" />}
              isActive={pathname === "/teams" ? true : false}
            />
          </NavLink>
        )}

        {priviledge.includes("CHANNELS") && (
          <NavLink to="/channels">
            <SideBarItem
              title="Channels"
              icon={<FaSlackHash size="25px" color="white" />}
              isActive={pathname === "/channels" ? true : false}
            />
          </NavLink>
        )}

        {priviledge.includes("CUSTOMERS") && (
          <NavLink to="/customers">
            <SideBarItem
              title="Customers"
              icon={<FaUserFriends size="20px" color="white" />}
              isActive={pathname === "/customers" ? true : false}
            />
          </NavLink>
        )}

        {priviledge.includes("CATEGORY") && (
          <NavLink to="/category">
            <SideBarItem
              title="Categories"
              icon={<FaBars size="20px" color="white" />}
              isActive={pathname === "/category" ? true : false}
            />
          </NavLink>
        )}
      </VStack>

      <Spacer />

      <VStack py={5}>
        <Icon
          as={FaBell}
          boxSize="5"
          color={colorMode === "light" ? "gray.400" : "white"}
        />
        <IconButton
          onClick={toggleColorMode}
          size="lg"
          variant="ghost"
          aria-label="change theme"
          icon={themeIcon}
        />
        <Avatar size="sm" name={email} />
      </VStack>
    </Flex>
    // </SlideFade>
  );
};

export default SideBar;
