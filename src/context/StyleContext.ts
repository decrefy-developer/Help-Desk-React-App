import React from "react";

interface Icontext {
  borderLine: string;
  bgColor: string;
  isSideBarShow: boolean;
}

const StyleContext = React.createContext<Icontext>({
  borderLine: "gray.300",
  bgColor: "gray.300",
  isSideBarShow: false,
});

export default StyleContext;
