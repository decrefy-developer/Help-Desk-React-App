import { useColorModeValue } from "@chakra-ui/color-mode";
import { Box, Text } from "@chakra-ui/layout";
import React, { ReactElement } from "react";

interface IconAppProps {
  title: string;
  icon: ReactElement;
  isActive?: boolean;
  borderRadius?: string;
}
const SideBarItem: React.FC<IconAppProps> = ({
  title,
  icon,
  isActive,
  borderRadius,
}) => {
  const iconBg = useColorModeValue("gray.400", "gray.700");

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        as="button"
        h="45px"
        w="45px"
        transition="all 0.2s cubic-bezier(0.8,.52,.52,1)"
        borderRadius={borderRadius ? borderRadius : "1px"}
        bg={iconBg}
        _hover={{
          transform: "scale(1.2)",
        }}
        _active={{
          transform: "scale(0.98)",
          bg: "purple.600",
        }}
        _focus={{
          boxShadow: "0 0 1px 1px purple.500, 0 1px 1px rgba(0, 0, 0, .15)",
          bg: "purple.500",
        }}
        bgColor={isActive ? "purple.600" : "none"}
      >
        {icon}
      </Box>
      <Text fontSize="xs" mt={1}>
        {title}
      </Text>
    </Box>
  );
};

export default SideBarItem;
