import React from "react";

interface Icontext {
  borderLine: string;
  bgColor: string;
  isSideBarShow: boolean;
  openTicketDrawer: () => void;
}

const StyleContext = React.createContext<Icontext>({
  borderLine: "gray.300",
  bgColor: "gray.300",
  isSideBarShow: false,
  openTicketDrawer: () => { },
});

export default StyleContext;
