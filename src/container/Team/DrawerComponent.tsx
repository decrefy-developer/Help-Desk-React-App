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
  FormLabel,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAddTeamMutation } from "../../app/features/team-query";
import { schemaTeam } from "../../models/schemas";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerComponent: React.FC<Props> = ({ isOpen, onClose }) => {
  const [addTeam, { isLoading }] = useAddTeamMutation();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<{ name: string }>({
    mode: "onChange",
    resolver: yupResolver(schemaTeam),
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
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <DrawerOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerContent>
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
