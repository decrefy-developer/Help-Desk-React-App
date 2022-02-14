import { Box } from "@chakra-ui/react";
import React from "react";

interface IProps {
  children: React.ReactNode;
  [x: string]: any;
}

const PageContentScroll: React.FC<IProps> = (props) => {
  const { children } = props;
  return (
    <Box
      {...props}
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
      {children}
    </Box>
  );
};

export default PageContentScroll;
