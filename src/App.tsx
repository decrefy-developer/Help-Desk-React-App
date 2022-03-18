import { useRoutes, useNavigate } from "react-router-dom";
import {
  SlideFade,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";

import StyleContext from "./context/StyleContext";
import Router from "./routes";
import "./App.css";
import Toast from "./components/Toast";
import { useDispatch } from "react-redux";
import { appDispatch } from "./app/store";
import "react-toastify/dist/ReactToastify.css";
import { useCallback, useEffect, useState } from "react";
import { DecodeToken } from "./utils/decode-token";
import Cookies from "js-cookie";
import DrawerTicket from "./components/DrawerTicket/DrawerTicket";
import {
  AddFloatingButton,
  BurgerFloatingButton,
} from "./components/FloatingButton";
import useNotification from "./hooks/useNotification";
import { IUser } from "./models/interface";

function App() {
  const color = useColorModeValue("gray.300", "gray.700");
  const routing = useRoutes(Router({ accessToken: Cookies.get("token") }));
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 767px)");
  const [showSideBar, setShowSideBar] = useState<boolean>(false); // used if the sidebar is show or not
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();
  const { requestPermission } = useNotification();

  const showNavitationHandler = useCallback(() => {
    setShowSideBar(!showSideBar);
  }, [showSideBar]);

  useEffect(() => {
    const decoded: IUser | null = DecodeToken();
    if (!decoded) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const checkTheLayout = () => {
      isMobile ? setShowSideBar(false) : setShowSideBar(true);
    };

    checkTheLayout();
  }, [isMobile]);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return (
    <StyleContext.Provider
      value={{
        borderLine: color,
        bgColor: color,
        isSideBarShow: showSideBar,
        openTicketDrawer: openDrawer,
      }}
    >
      {routing}
      <Toast />

      {isMobile && (
        <SlideFade in={isMobile} offsetY="20px">
          <BurgerFloatingButton showNavitation={showNavitationHandler} />
        </SlideFade>
      )}

      {isDrawerOpen && (
        <DrawerTicket
          formData={null}
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
        />
      )}
    </StyleContext.Provider>
  );
}

export default App;
