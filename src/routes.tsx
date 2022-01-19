import { Login, Home, Account, NotFound, Team, Channel } from "./pages";
import { Navigate } from "react-router";
import LoginLayout from "./layouts/LoginLayout";
import MainLayout from "./layouts/MainLayout";

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
      },
      {
        path: "members",
        element: accessToken ? <Account /> : <Navigate to="/login" />,
      },
      {
        path: "teams",
        element: accessToken ? <Team /> : <Navigate to="/login" />,
      },
      {
        path: "channels",
        element: accessToken ? <Channel /> : <Navigate to="/login" />,
      },
    ],
  },
];

export default Router;
