import {
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { FaSearch } from "react-icons/fa";
import StyleContext from "../context/StyleContext";

interface IsubHeading {
  /** @type {setSearch} - type of setState */
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  /** @return {()=> void}*/
  onOpen: () => void;
  /** @prop {padding} - type number, padding of the sub Header */
  padding: number;
  /** @prop {title} - type string, title of the heading */
  title: string;
  /** @prop {placeholder} - type string, placeholder of search input */
  placeHolder: string;
}

const SubHeadingComponent: React.FC<IsubHeading> = ({
  setSearch,
  onOpen,
  padding,
  title,
  placeHolder,
}) => {
  const { borderLine } = useContext(StyleContext);
  const [text, setText] = useState<string>("");

  const SearchSubmitHandler = () => {
    setSearch(text);
  };

  return (
    <Flex
      flexDirection="column"
      borderBottom="1px"
      borderColor={borderLine}
      py={8}
      px={padding}
    >
      <HStack justify="space-between">
        <Stack>
          <Text fontSize="x-large">{title}</Text>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button size="sm" variant="outline">
            Export
          </Button>
          <Button size="sm" bg="primary" onClick={onOpen}>
            Add
          </Button>
        </Stack>
      </HStack>

      <HStack mt={5}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<FaSearch color="gray.300" />}
          />
          <Input
            type="text"
            placeholder={placeHolder}
            variant="filled"
            onChange={(e) => setText(e.target.value)}
          />
        </InputGroup>
        <Button bg="#1dddcb" fontSize="sm" onClick={SearchSubmitHandler}>
          Search
        </Button>
      </HStack>
    </Flex>
  );
};
export default SubHeadingComponent;
