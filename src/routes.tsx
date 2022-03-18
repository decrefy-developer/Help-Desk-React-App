import { Navigate } from "react-router";
import LoginLayout from "./layouts/LoginLayout";
import MainLayout from "./layouts/MainLayout";
import MainContent from "./container/Home/MainContent/index";
import Login from "./container/Login";
import Member from "./container/Member";
import Team from "./container/Team";
import Channel from "./container/Channel";
import Home from "./container/Home";
import NotFound from "./container/NotFound";
import Report from "./container/Report";
import Department from "./container/Department";
import Requester from "./container/Requester";

const Router = ({ accessToken }: { accessToken: any }) => [
  {
    path: "",
    element: <LoginLayout />,
    children: [
      { path: "/", element: <Navigate to="/login" /> },
      { path: "login", element: <Login /> },
      { path: "*", element: <Navigate to="/404" /> },
      { path: "404", element: <NotFound /> },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "home",
        element: accessToken ? <Home /> : <Navigate to="/login" />,
        children: [{ path: ":channelId", element: <MainContent /> }],
      },
      {
        path: "requester",
        element: accessToken ? <Requester /> : <Navigate to="/login" />,
      },
      {
        path: "members",
        element: accessToken ? <Member /> : <Navigate to="/login" />,
      },
      {
        path: "teams",
        element: accessToken ? <Team /> : <Navigate to="/login" />,
      },
      {
        path: "channels",
        element: accessToken ? <Channel /> : <Navigate to="/login" />,
      },
      {
        path: "reports",
        element: accessToken ? <Report /> : <Navigate to="/login" />,
      },
      {
        path: "departments",
        element: accessToken ? <Department /> : <Navigate to="/login" />,
      },
    ],
  },
];

export default Router;
