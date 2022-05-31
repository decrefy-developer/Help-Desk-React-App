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
import { ACCESS, IUser } from "./models/interface";
import Ticket from "./container/Ticket";
import Category from "./container/Category";
import TransferTicket from "./container/Home/MainContent/TransferTicket";

const Router = ({ decodedToken }: { decodedToken: IUser | null }) => [
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
        element: decodedToken ? <Home /> : <Navigate to="/login" />,
        children: [
          { path: ":channelId", element: <MainContent /> },
          { path: "transfer/:teamId", element: <TransferTicket /> },
        ],
      },
      {
        path: "requester",
        element: decodedToken?.priviledge.includes(ACCESS.REQUESTER) ? (
          <Requester />
        ) : (
          <Navigate to="/login" />
        ),
      },
      {
        path: "members",
        element: decodedToken?.priviledge.includes(ACCESS.MEMBERS) ? (
          <Member />
        ) : (
          <Navigate to="/login" />
        ),
      },
      {
        path: "teams",
        element: decodedToken?.priviledge.includes(ACCESS.TEAMS) ? (
          <Team />
        ) : (
          <Navigate to="/login" />
        ),
      },
      {
        path: "channels",
        element: decodedToken?.priviledge.includes(ACCESS.CHANNELS) ? (
          <Channel />
        ) : (
          <Navigate to="/login" />
        ),
      },
      {
        path: "reports",
        element: decodedToken?.priviledge.includes(ACCESS.CREATE_TICKET) ? (
          <Report />
        ) : (
          <Navigate to="/login" />
        ),
      },
      {
        path: "departments",
        element: decodedToken?.priviledge.includes(ACCESS.DEPARTMENT) ? (
          <Department />
        ) : (
          <Navigate to="/login" />
        ),
      },
      {
        path: "categories",
        element: decodedToken?.priviledge.includes(ACCESS.CATEGORY) ? (
          <Category />
        ) : (
          <Navigate to="/login" />
        ),
      },
      {
        path: "tickets",
        element: decodedToken?.priviledge.includes(ACCESS.CREATE_TICKET) ? (
          <Ticket />
        ) : (
          <Navigate to="/login" />
        ),
      },
    ],
  },
];

export default Router;
