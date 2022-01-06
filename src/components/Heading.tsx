import { HStack, Text } from "@chakra-ui/react";
import { useContext } from "react";
import StyleContext from "../context/StyleContext";

const HeadingComponent = ({ title }: { title: string }) => {
  const { borderLine } = useContext(StyleContext);
  return (
    <HStack borderBottom="1px" borderColor={borderLine} p={3}>
      <Text fontSize="xl">{title}</Text>
    </HStack>
  );
};

export default HeadingComponent;
