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

const SubHeadingComponent = ({
  setSearch,
  onOpen,
  padding,
}: {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  onOpen: () => void;
  padding: number;
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
          <Text fontSize="x-large">Team List</Text>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button size="sm" variant="outline">
            Export
          </Button>
          <Button size="sm" bg="primary" onClick={onOpen}>
            Add Team
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
            placeholder="Seach a team: Enter team name"
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
