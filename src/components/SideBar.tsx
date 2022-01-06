import React, { useContext } from "react";
import { Flex, Spacer, VStack } from "@chakra-ui/layout";
import {
  useColorMode,
  IconButton,
  Icon,
  Avatar,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  FaHome,
  FaCog,
  FaSun,
  FaMoon,
  FaBell,
  FaSearch,
  FaUserFriends,
  FaUserCog,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import StyleContext from "../context/StyleContext";
import SideBarItem from "./SideBarItem";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const SideBar: React.FC = () => {
  const { email, priviledge } = useSelector(
    (state: RootState) => state.userSlice
  );
  const { borderLine } = useContext(StyleContext);
  const { toggleColorMode, colorMode } = useColorMode();
  const [isMobile] = useMediaQuery("(min-width: 767px)");

  console.log(priviledge);

  let themeIcon =
    colorMode === "light" ? <FaMoon color="#a0aec0" /> : <FaSun />;
  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      display={isMobile ? undefined : "none"}
      borderRight="1px"
      borderRightColor={borderLine}
      p={4}
    >
      <VStack spacing={5}>
        <NavLink to="/home">
          <SideBarItem
            title="Home"
            icon={<FaHome size="20px" color="white" />}
          />
        </NavLink>
        <SideBarItem
          title="Setting"
          icon={<FaCog size="20px" color="white" />}
        />
        <NavLink to="/members">
          <SideBarItem
            title="Members"
            icon={<FaUserCog size="20px" color="white" />}
          />
        </NavLink>
        <SideBarItem
          title="Teams"
          icon={<FaUserFriends size="20px" color="white" />}
        />
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
  );
};

export default SideBar;
