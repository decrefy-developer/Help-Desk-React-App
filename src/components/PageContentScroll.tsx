import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

interface IProps {
  children: React.ReactNode;
  [x: string]: any;
}

const PageContentScroll: React.FC<IProps> = (props) => {
  const [screenSize, getDimension] = useState({
    dynamicHeight: window.innerHeight * 0.7,
  });

  const setDimension = () => {
    getDimension({ dynamicHeight: window.innerHeight * 0.7 });
  };

  useEffect(() => {
    window.addEventListener("resize", setDimension);

    return () => {
      window.removeEventListener("resize", setDimension);
    };
  }, [screenSize]);

  return (
    <Box
      maxH={`${Math.round(screenSize.dynamicHeight)}px`}
      flexDirection="column"
      overflowY="auto"
      sx={{
        "&::-webkit-scrollbar": {
          width: "5px",
          borderRadius: "1px",
          backgroundColor: `rgba(0, 0, 0, 0.05)`,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "gray.700",
        },
      }}
    >
      {props.children}
    </Box>
  );
};

export default PageContentScroll;
