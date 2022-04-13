import {
  Button,
  Collapse,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Textarea,
  useDisclosure,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { FaCross, FaPlus, FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAddRequestMutation } from "../../app/features/request-query";
import StyleContext from "../../context/StyleContext";
import { IUser } from "../../models/interface";
import { DecodeToken } from "../../utils/decode-token";

interface Iprops {
  screenPadding: number;
  setTextSearch: React.Dispatch<React.SetStateAction<string>>;
}

const SubHeadingComponent: React.FC<Iprops> = ({
  screenPadding,
  setTextSearch,
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const [concern, setConcern] = useState<string>();
  const [error, setError] = useState<string>("");
  const { borderLine } = useContext(StyleContext);
  const decoded: IUser | null = DecodeToken();

  const [addRequest] = useAddRequestMutation();

  const submitHandler = async () => {
    try {
      if (!concern) return setError("Concern is required");

      const input = {
        userId: decoded ? decoded._id : "",
        concern,
      };

      const result = await addRequest(input).unwrap();
      if (result) {
        toast.success("Request submitted successfully");
        setConcern("");
        onToggle();
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  const onChangeHandler = (e: any) => {
    setConcern(e.target.value);
  };

  return (
    <Flex p={screenPadding}>
      <VStack w="full" alignItems="flex-start">
        <Button
          size="sm"
          bgColor="primary"
          leftIcon={<FaPlus />}
          onClick={onToggle}
        >
          Add Request
        </Button>

        <Collapse in={isOpen} animateOpacity style={{ width: "100%" }}>
          <VStack alignItems="flex-start">
            <FormControl isInvalid={error ? true : false}>
              <FormLabel htmlFor="concern" fontSize="sm" color="gray.400">
                Concern Details
              </FormLabel>
              <Textarea
                id="concern"
                focusBorderColor="purple.500"
                placeholder="ex: I can't login my account"
                size="sm"
                height="120px"
                onChange={onChangeHandler}
                value={concern}
              />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>

            <HStack>
              <Button
                onClick={submitHandler}
                bgColor="success"
                size="sm"
                disabled={concern ? false : true}
              >
                Sumit
              </Button>
              <Button type="submit" size="sm" onClick={onToggle}>
                Cancel
              </Button>
            </HStack>
          </VStack>
        </Collapse>

        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<FaSearch color="gray.300" />}
          />
          <Input
            type="text"
            placeholder="Search : ticket# or concern"
            variant="filled"
            onChange={(e) => setTextSearch(e.target.value)}
          />
        </InputGroup>
      </VStack>
    </Flex>
  );
};

export default SubHeadingComponent;
