import { useRoutes, useNavigate } from "react-router-dom";
import {
  ScaleFade,
  SlideFade,
  useColorModeValue,
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
import { DecodeToken } from "./services/decode-token";
import { setUser } from "./features/user-slice";
import Cookies from "js-cookie";
import FloatingButton from "./components/FloatingButton";

function App() {
  const color = useColorModeValue("gray.300", "gray.700");
  const routing = useRoutes(Router({ accessToken: Cookies.get("token") }));
  const dispatch = useDispatch<appDispatch>();
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 767px)");
  const [showSideBar, setShowSideBar] = useState<boolean>(false); // used if the sidebar is show or not

  const showNavitationHandler = useCallback(() => {
    setShowSideBar(!showSideBar);
  }, [showSideBar]);

  useEffect(() => {
    const checkTheLayout = () => {
      isMobile ? setShowSideBar(false) : setShowSideBar(true);
    };

    checkTheLayout();

    const decoded: any = DecodeToken();
    if (decoded) {
      dispatch(setUser(decoded));
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, isMobile]);

  return (
    <StyleContext.Provider
      value={{ borderLine: color, bgColor: color, isSideBarShow: showSideBar }}
    >
      {routing}
      <Toast />

      {isMobile && (
        <SlideFade in={isMobile} offsetY="20px">
          <FloatingButton showNavitation={showNavitationHandler} />
        </SlideFade>
      )}
    </StyleContext.Provider>
  );
}

export default App;
