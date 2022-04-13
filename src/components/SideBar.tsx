import React, { useContext } from "react";
import { Flex, Spacer, VStack } from "@chakra-ui/layout";
import {
  useColorMode,
  IconButton,
  Icon,
  Avatar,
  useDisclosure,
} from "@chakra-ui/react";
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
  FaFileAlt,
  FaRegWindowRestore,
  FaTicketAlt,
} from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import StyleContext from "../context/StyleContext";
import SideBarItem from "./SideBarItem";
import NotificationDrawer from "./NotificationDrawer";
import { URLS } from "../URLS";
import { DecodeToken } from "../utils/decode-token";
import { ACCESS, IUser } from "../models/interface";

const SideBar: React.FC = () => {
  const { pathname } = useLocation();
  const { borderLine, isSideBarShow } = useContext(StyleContext);
  const { toggleColorMode, colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const decoded: IUser | null = DecodeToken();

  let themeIcon =
    colorMode === "light" ? <FaMoon color="#a0aec0" /> : <FaSun />;
  return (
    <>
      <Flex
        direction="column"
        justifyContent="space-between"
        display={isSideBarShow ? "flex" : "none"}
        borderRight="1px"
        borderRightColor={borderLine}
        p={4}
        overflowY="auto"
        sx={{
          "&::-webkit-scrollbar": {
            width: "2px",
            borderRadius: "1px",
          },
          "&::-webkit-scrollbar-thumb": {
            // backgroundColor: "gray.700",
          },
        }}
      >
        <VStack spacing={5}>
          {(decoded?.priviledge.includes(ACCESS.SUPPORT) || decoded?.priviledge.includes(ACCESS.CREATE_TICKET)) && (
            <NavLink to={URLS.HOME}>
            <SideBarItem
              title="Home"
              icon={<FaHome size="20px" color="white" />}
              isActive={pathname === URLS.HOME ? true : false}
            />
          </NavLink>
          )}

          {decoded?.priviledge.includes(ACCESS.REQUESTER) && (
            <NavLink to={URLS.REQUESTER}>
              <SideBarItem
                title="Request"
                icon={<FaRegWindowRestore size="20px" color="white" />}
                isActive={pathname === URLS.REQUESTER ? true : false}
              />
            </NavLink>
          )}

          {decoded?.priviledge.includes(ACCESS.DEPARTMENT) && (
            <NavLink to={URLS.DEPARTMENT}>
              <SideBarItem
                title="Department"
              icon={<FaUserCog size="20px" color="white" />}
                isActive={pathname === URLS.DEPARTMENT ? true : false}
              />
            </NavLink>
          )}

          {decoded?.priviledge.includes(ACCESS.MEMBERS) && (
            <NavLink to={URLS.MEMBER}>
              <SideBarItem
                title="Members"
                icon={<FaUserCog size="20px" color="white" />}
                isActive={pathname === URLS.MEMBER ? true : false}
              />
            </NavLink>
          )}

          {decoded?.priviledge.includes(ACCESS.TEAMS) && (
            <NavLink to={URLS.TEAM}>
              <SideBarItem
                title="Teams"
                icon={<FaSlack size="20px" color="white" />}
                isActive={pathname === URLS.TEAM ? true : false}
              />
            </NavLink>
          )}

          {decoded?.priviledge.includes(ACCESS.CHANNELS) && (
            <NavLink to={URLS.CHANNEL}>
              <SideBarItem
                title="Channels"
                icon={<FaSlackHash size="25px" color="white" />}
                isActive={pathname === URLS.CHANNEL ? true : false}
              />
            </NavLink>
          )}

          {decoded?.priviledge.includes(ACCESS.CATEGORY) && (
            <NavLink to={URLS.CATEGORY}>
              <SideBarItem
                title="Categories"
                icon={<FaBars size="20px" color="white" />}
                isActive={pathname === URLS.CATEGORY ? true : false}
              />
            </NavLink>
          )}

          {decoded?.priviledge.includes(ACCESS.CREATE_TICKET) && (
            <NavLink to={URLS.TICKET}>
              <SideBarItem
                title="Tickets"
                icon={<FaTicketAlt size="20px" color="white" />}
                isActive={pathname === URLS.TICKET ? true : false}
              />
            </NavLink>
          )}

          {decoded?.priviledge.includes(ACCESS.CREATE_TICKET) && (
            <NavLink to={URLS.REPORTS}>
              <SideBarItem
                title="Generate"
                icon={<FaFileAlt size="20px" color="white" />}
                isActive={pathname === URLS.REPORTS ? true : false}
              />
            </NavLink>
          )}
        </VStack>

        <Spacer />

        <VStack pt={10}>
          <Icon
            onClick={onOpen}
            cursor="pointer"
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
          <Avatar size="sm" name={decoded?.email} />
        </VStack>
      </Flex>

      {isOpen && <NotificationDrawer isOpen={isOpen} onClose={onClose} />}
    </>
  );
};

export default SideBar;
