import { HStack, Text } from "@chakra-ui/react";
import { useContext } from "react";
import StyleContext from "../context/StyleContext";

interface IHeading {
  /**
   * @prop {title} - type string, this will be the title of the heading
   */
  title: string;
}

const HeadingComponent: React.FC<IHeading> = ({ title }) => {
  const { borderLine } = useContext(StyleContext);
  return (
    <HStack borderBottom="1px" borderColor={borderLine} p={3}>
      <Text fontSize="xl">{title}</Text>
    </HStack>
  );
};

export default HeadingComponent;
