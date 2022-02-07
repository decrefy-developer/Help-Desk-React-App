import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  HStack,
  Icon,
  Input,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaAngleLeft, FaAngleRight, FaCaretDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAddChannelMutation } from "../../features/channel-query";
import { useListTeamQuery } from "../../features/team-query";
import { schemaChannel } from "../../models/schemas";

const DrawerComponent: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [page, setPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const [addChannel, { isLoading }] = useAddChannelMutation();
  const { data, isError, isFetching } = useListTeamQuery({
    page: page,
    limit: 10,
    search: searchText,
    status: true,
  });

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<{ teamId: string; name: string }>({
    mode: "onChange",
    resolver: yupResolver(schemaChannel),
  });

  const nextPageHandler = () => {
    const nextPage = data?.nextPage;
    setPage(Number(nextPage));
  };

  const previewPageHandler = () => {
    const prevPage = data?.prevPage;
    setPage(Number(prevPage));
  };

  const onSubmit = async (data: { name: string }) => {
    try {
      const result = await addChannel(data).unwrap();

      if (result) {
        onClose();
        reset();
        toast.success(`${result.name}  was successfully added.`);
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  useEffect(() => {
    if (isError)
      return alert("An error has occurred!, please refresh the page");
  }, [isError]);

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <DrawerOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Create a new channel
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Input
                    variant="unstyled"
                    placeholder="search team here.."
                    fontSize="sm"
                    onChange={(e) => setSearchText(e.target.value)}
                  />
                  <HStack>
                    <Button
                      variant="ghost"
                      size="xs"
                      disabled={!data?.hasPrevPage}
                      onClick={previewPageHandler}
                    >
                      <Icon as={FaAngleLeft} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="xs"
                      disabled={!data?.hasNextPage}
                      onClick={nextPageHandler}
                    >
                      <Icon as={FaAngleRight} />
                    </Button>
                  </HStack>
                </Box>
                <Select
                  icon={
                    isFetching ? (
                      <CircularProgress
                        isIndeterminate
                        color="primary"
                        size="20px"
                      />
                    ) : (
                      <FaCaretDown />
                    )
                  }
                  placeholder="Select Team"
                  id="team"
                  {...register("teamId")}
                >
                  {data?.docs.map((team) => (
                    <option value={team._id} key={team._id}>
                      {team.name}
                    </option>
                  ))}
                </Select>
              </Box>
              <Box>
                <FormLabel htmlFor="channel" fontSize="sm" color="gray.400">
                  Channel Name
                </FormLabel>
                <Input
                  autoComplete="off"
                  id="channel"
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
              isLoading={isLoading}
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default DrawerComponent;
