import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import HeadingComponent from "../components/Heading";
import StyleContext from "../context/StyleContext";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAddTeamMutation, useListTeamQuery } from "../features/team-query";

const schema = yup.object().shape({
  name: yup.string().required("Team name is required").min(5),
});

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

const DrawerComponent = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const firstField = useRef(null);
  const [addTeam] = useAddTeamMutation();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<{ name: string }>({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { name: string }) => {
    try {
      const result = await addTeam(data).unwrap();

      if (result) {
        onClose();
        reset();
        toast.success(`${result.name}  was successfully added.`);
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      initialFocusRef={firstField}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <DrawerOverlay />
      <DrawerContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Create a new team</DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="email">Team Name</FormLabel>
                <Input
                  autoComplete="off"
                  id="name"
                  placeholder="Please enter name"
                  {...register("name")}
                />
                <Text textAlign="left" fontSize="xs" p={1} color="danger">
                  {errors.name?.message}
                </Text>
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              disabled={!isDirty || !isValid}
              colorScheme="blue"
              type="submit"
              // isLoading={isLoading}
            >
              Submit
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

const TeamPage = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [isArchieve, setIsArchieve] = useState<boolean>(false);
  const [screenPadding, setScreenPadding] = useState<number>(4);
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure(); // for the drawer
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const { data, isError, isLoading, isFetching } = useListTeamQuery({
    page,
    limit,
    search,
    status: !isArchieve,
  });

  useEffect(() => {
    if (isError)
      return alert("An error has occurred!, please refresh the page");

    if (isMobile === false) {
      setScreenPadding(20);
    } else {
      setScreenPadding(4);
    }
  }, [isMobile, isError]);

  return (
    <React.Fragment>
      <Flex w="full" flexDirection="column">
        <HeadingComponent title="Manage Teams" />

        <SubHeadingComponent
          onOpen={openDrawer}
          padding={screenPadding}
          setSearch={setSearch}
        />

        {isLoading ? (
          <Stack w="full" py={10} px="20">
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        ) : (
          <Text>Table</Text>
        )}
      </Flex>

      {isDrawerOpen && (
        <DrawerComponent isOpen={isDrawerOpen} onClose={closeDrawer} />
      )}
    </React.Fragment>
  );
};

export default TeamPage;
