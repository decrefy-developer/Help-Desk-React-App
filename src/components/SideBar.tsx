import React, { useContext } from 'react';
import { Flex, Spacer, VStack } from '@chakra-ui/layout';
import {
  useColorMode,
  IconButton,
  Icon,
  Avatar,
  useDisclosure,
  useColorModeValue,
  useMediaQuery,
  Button,
  Stack,
} from '@chakra-ui/react';
import {
  FaHome,
  FaSun,
  FaMoon,
  FaBell,
  FaSlack,
  FaSlackHash,
  FaBars,
  FaFileAlt,
  FaRegWindowRestore,
  FaTicketAlt,
  FaUserCog,
} from 'react-icons/fa';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import StyleContext from '../context/StyleContext';
import SideBarItem from './SideBarItem';
import NotificationDrawer from './NotificationDrawer';
import { URLS } from '../URLS';
import { DecodeToken } from '../utils/decode-token';
import { ACCESS, IUser } from '../models/interface';
import ModalComponent from './Modal';
import Cookies from 'js-cookie';

const SideBar: React.FC = () => {
  const { pathname } = useLocation();
  const { borderLine, isSideBarShow } = useContext(StyleContext);
  const { toggleColorMode, colorMode } = useColorMode();
  const logoutModal = useDisclosure();
  const { isOpen, onClose } = useDisclosure();
  const decoded: IUser | null = DecodeToken();
  const color = useColorModeValue('white', 'gray.800');
  const [isMobile] = useMediaQuery('(max-width: 767px)');
  const navigate = useNavigate();

  let themeIcon =
    colorMode === 'light' ? <FaMoon color="#a0aec0" /> : <FaSun />;

  async function logoutHandler() {
    await Cookies.remove('token');
    await Cookies.remove('x-refresh');

    navigate('/');
  }
  return (
    <>
      <Flex
        position={isMobile ? 'fixed' : 'relative'}
        left="0"
        top="0"
        bottom="0"
        zIndex="100"
        height="100vh"
        backgroundColor={color}
        direction="column"
        justifyContent="space-between"
        display={isSideBarShow ? 'flex' : 'none'}
        borderRight="1px"
        borderRightColor={borderLine}
        p={4}
        overflowY="scroll"
        sx={{
          '&::-webkit-scrollbar': {
            width: '2px',
            borderRadius: '1px',
          },
          '&::-webkit-scrollbar-thumb': {
            // backgroundColor: "gray.700",
          },
        }}
      >
        <VStack spacing={5}>
          {(decoded?.priviledge.includes(ACCESS.SUPPORT) ||
            decoded?.priviledge.includes(ACCESS.CREATE_TICKET)) && (
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
                title="Filling"
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
            onClick={() => alert('will be available in next update')}
            cursor="pointer"
            as={FaBell}
            boxSize="5"
            color={colorMode === 'light' ? 'gray.400' : 'white'}
          />
          <IconButton
            onClick={toggleColorMode}
            size="lg"
            variant="ghost"
            aria-label="change theme"
            icon={themeIcon}
          />
          <Avatar
            size="sm"
            name={decoded?.email}
            cursor="pointer"
            onClick={logoutModal.onOpen}
          />
        </VStack>
      </Flex>

      {isOpen && <NotificationDrawer isOpen={isOpen} onClose={onClose} />}

      {logoutModal.isOpen && (
        <ModalComponent
          isOpen={logoutModal.isOpen}
          onClose={logoutModal.onClose}
          title="Logout"
          isCentered={true}
          size="sm"
        >
          <Stack direction="row" mb={3}>
            <Button size="sm" bgColor="primary" onClick={logoutHandler}>
              Yes
            </Button>
            <Button size="sm">No</Button>
          </Stack>
        </ModalComponent>
      )}
    </>
  );
};

export default SideBar;
