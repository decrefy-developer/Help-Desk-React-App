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
import { useAddCategoryMutation } from "../../app/features/category-query";
import { useAddDepartmentMutation } from "../../app/features/department-query";
import { IFormInputDepartment } from "../../models/interface";
import { schemaCategory } from "../../models/schemas";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DrawerComponent: React.FC<Props> = ({ isOpen, onClose }) => {
  const [addCategory, { isLoading }] = useAddCategoryMutation();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<{ name: string }>({
    mode: "onChange",
    resolver: yupResolver(schemaCategory),
  });

  const onSubmit = async (data: IFormInputDepartment) => {
    try {
      const result = await addCategory(data).unwrap();

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
          <DrawerHeader borderBottomWidth="1px">
            Create a new category
          </DrawerHeader>
          <DrawerBody>
            <Stack spacing="24px">
              <Box mt={4}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  autoComplete="off"
                  id="name"
                  placeholder="Please enter name"
                  {...register("name")}
                  autoFocus={true}
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
