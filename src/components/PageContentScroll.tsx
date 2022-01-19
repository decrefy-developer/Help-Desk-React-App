import { Box } from "@chakra-ui/react";
import React from "react";

const PageContentScroll: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Box
      flexDirection="column"
      overflowY="auto"
      mh="600px"
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
