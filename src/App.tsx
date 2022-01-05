import { useRoutes, useNavigate } from "react-router-dom";
import { useColorModeValue } from "@chakra-ui/react";

import StyleContext from "./context/StyleContext";
import Router from "./routes";
import "./App.css";
import Toast from "./components/Toast";
import { useDispatch } from "react-redux";
import { appDispatch } from "./app/store";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { DecodeToken } from "./services/decode-token";
import { setUser } from "./features/user-slice";
import Cookies from "js-cookie";

function App() {
  console.log("RENDER: App");
  const color = useColorModeValue("gray.300", "gray.700");
  const routing = useRoutes(Router({ accessToken: Cookies.get("token") }));
  const dispatch = useDispatch<appDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const decoded: any = DecodeToken();
    if (decoded) {
      dispatch(setUser(decoded));
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate]);

  return (
    <StyleContext.Provider value={{ borderLine: color, bgColor: color }}>
      {routing}
      <Toast />
    </StyleContext.Provider>
  );
}

export default App;
