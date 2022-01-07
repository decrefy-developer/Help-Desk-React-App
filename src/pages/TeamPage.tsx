import {
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  CircularProgress,
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
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSearch, FaEllipsisH } from "react-icons/fa";
import { toast } from "react-toastify";
import HeadingComponent from "../components/Heading";
import StyleContext from "../context/StyleContext";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ITeam,
  useAddTeamMutation,
  useListTeamQuery,
} from "../features/team-query";
import { ListResponse } from "../features/data-types";
import moment from "moment";
import Pagination from "@choc-ui/paginator";

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

const PaginationComponent = () => {};

const TableComponent = ({
  data,
  padding,
  rowId,
}: {
  data: ListResponse<ITeam> | undefined;
  padding: number;
  rowId: string;
}) => {
  const rowBgColor = useColorModeValue("gray.400", "gray.700");
  return (
    <Flex mx={padding}>
      <Stack
        direction={{ base: "column" }}
        w="full"
        spacing={{ base: "3", md: "0" }}
      >
        <SimpleGrid
          display={{ base: "none", md: "grid" }}
          spacingY={3}
          columns={{ base: 1, md: 4 }}
          w="full"
          py={2}
          px={10}
          fontWeight="hairline"
          border="1px"
          borderColor={rowBgColor}
          alignItems="center"
          justifyContent="center"
        >
          <Text color="accent" fontWeight="normal">
            Name
          </Text>
          <Text color="accent" fontWeight="normal">
            Status
          </Text>
          <Text color="accent" fontWeight="normal">
            Last Modified
          </Text>
          <Text></Text>
        </SimpleGrid>
        {data?.docs.map((user) => {
          return (
            <Flex direction={{ base: "row", md: "column" }} key={user._id}>
              <SimpleGrid
                spacingY={3}
                columns={{ base: 1, md: 4 }}
                w="full"
                py={2}
                px={10}
                fontWeight="hairline"
                borderBottom="1px"
                borderRight="1px"
                borderLeft="1px"
                borderTop={{ base: "1px", md: "0px" }}
                borderColor={rowBgColor}
                alignItems="center"
                justifyContent="center"
                bgColor={rowId === user._id ? "gray.700" : "none"}
              >
                <Flex alignItems="center">
                  <Text mx={2} fontSize="sm" fontWeight="normal">
                    {user.name}
                  </Text>
                </Flex>

                <Text fontSize="sm" fontWeight="normal">
                  {user.isActive ? (
                    <Badge colorScheme="green">Active</Badge>
                  ) : (
                    <Badge colorScheme="red">Deactivated</Badge>
                  )}
                </Text>

                <Text fontSize="sm" fontWeight="normal">
                  {moment(user.updatedAt).format("MMM DD, YYYY")}
                </Text>

                <Menu isLazy>
                  <MenuButton>
                    <Icon as={FaEllipsisH} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem>View channels</MenuItem>
                    <MenuItem color="warning">Reset password</MenuItem>
                    <MenuItem color="danger">Deactivate account</MenuItem>
                  </MenuList>
                </Menu>
              </SimpleGrid>
            </Flex>
          );
        })}
      </Stack>
    </Flex>
  );
};

const TeamPage = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [isArchieve, setIsArchieve] = useState<boolean>(false);
  const [screenPadding, setScreenPadding] = useState<number>(4);
  const [rowId, setRowId] = useState<string>(""); // use for highlight the row of the table

  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure(); // for the drawer
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const { data, isError, isLoading, isFetching, refetch } = useListTeamQuery({
    page,
    limit,
    search,
    status: !isArchieve,
  });

  const onChangePageHandler = (pageNumber: any) => {
    setPage(Number(pageNumber));
  };

  const onChangeLimitHandler = (limitNumber: any) => {
    setLimit(Number(limitNumber));
    refetch();
  };

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

        <Flex
          py={8}
          px={screenPadding}
          w="full"
          alignItems="center"
          justifyContent="space-between"
          direction={isMobile ? "column" : "row"}
        >
          {isLoading ? (
            <HStack>
              <CircularProgress isIndeterminate color="primary" size="30px" />
              <Text color="gray.500">Pagination loading..</Text>
            </HStack>
          ) : (
            <HStack>
              <Pagination
                currentPage={page}
                total={data?.totalDocs}
                paginationProps={{ display: "flex" }}
                baseStyles={{ border: "1px" }}
                activeStyles={{ bg: "primary" }}
                onChange={(page) => onChangePageHandler(page)}
                pageSize={limit}
                showSizeChanger
                onShowSizeChange={(__, size) => {
                  onChangeLimitHandler(size);
                  onChangePageHandler(1);
                }}
              />
              <Text fontSize="sm" color="gray.500">
                Items: {data?.totalDocs}
              </Text>
            </HStack>
          )}

          <HStack alignContent="center">
            {isFetching && (
              <CircularProgress isIndeterminate color="primary" size="30px" />
            )}

            <Checkbox onChange={(e) => setIsArchieve(e.target.checked)}>
              <Text fontSize="sm" color="gray.500">
                show archived
              </Text>
            </Checkbox>
          </HStack>
        </Flex>

        {isLoading ? (
          <Stack w="full" py={10} px="20">
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
        ) : (
          <TableComponent data={data} rowId={rowId} padding={screenPadding} />
        )}
      </Flex>

      {isDrawerOpen && (
        <DrawerComponent isOpen={isDrawerOpen} onClose={closeDrawer} />
      )}
    </React.Fragment>
  );
};

export default TeamPage;
