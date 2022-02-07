import {
  Box,
  Button,
  Checkbox,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAddMemberMutation } from "../../features/member-query";
import { IFormInputMember } from "../../models/interface";
import { schemaAccount } from "../../models/schemas";
import Socket from "../../services/Socket";

const DrawerNewMemberComponent: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const firstField = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [checkedAccess, setCheckedAccess] = useState<Array<string>>([]);
  const [checboxError, setCheckboxError] = useState(false);
  const [addMember, { isLoading }] = useAddMemberMutation();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<IFormInputMember>({
    mode: "onChange",
    resolver: yupResolver(schemaAccount),
    defaultValues: {
      email: " ",
      password: "",
      confirmPassword: "",
      priviledge: [],
    },
  });

  const onSubmit: SubmitHandler<IFormInputMember> = async (data) => {
    try {
      if (checkedAccess.length <= 0) return setCheckboxError(true);
      data.priviledge = checkedAccess;

      const result = await addMember(data).unwrap();
      if (result) {
        onClose();
        reset();
        toast.success(`${result.email} has been successfully added`);
      }

      //   await Socket.emit("send", result.email);
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  const showPasswordHandler = () => setShowPassword(!showPassword);

  const setAccess = (isChecked: boolean, item: string) => {
    if (isChecked) {
      setCheckedAccess([...checkedAccess, item]);
    } else {
      setCheckedAccess(checkedAccess.filter((access) => access !== item));
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Create a new account
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="email" fontSize="sm" color="gray.400">
                  Email
                </FormLabel>
                <Input
                  type="email"
                  autoComplete="flase"
                  id="email"
                  placeholder="Please enter email"
                  {...register("email")}
                />
                <Text textAlign="left" fontSize="xs" p={1} color="danger">
                  {errors.email?.message}
                </Text>
              </Box>

              <Box>
                <FormLabel htmlFor="password" fontSize="sm" color="gray.400">
                  Password
                </FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Please enter password"
                    {...register("password")}
                  />
                  <InputRightElement>
                    <Icon
                      _hover={{ cursor: "pointer" }}
                      as={showPassword ? FaEyeSlash : FaEye}
                      onClick={showPasswordHandler}
                    />
                  </InputRightElement>
                </InputGroup>
                <Text textAlign="left" fontSize="xs" p={1} color="danger">
                  {errors.password?.message}
                </Text>
              </Box>

              <Box>
                <FormLabel
                  htmlFor="confirm-password"
                  fontSize="sm"
                  color="gray.400"
                >
                  Confirm-password
                </FormLabel>
                <Input
                  type="password"
                  id="confirm-password"
                  placeholder="Please enter confirm-password"
                  {...register("confirmPassword")}
                />
                <Text textAlign="left" fontSize="xs" p={1} color="danger">
                  {errors.confirmPassword?.message}
                </Text>
              </Box>

              <Box>
                <Stack spacing={2}>
                  <FormLabel fontSize="sm" color="gray.400">
                    Access
                  </FormLabel>
                  <Checkbox
                    onChange={(e) => setAccess(e.target.checked, "MEMBERS")}
                  >
                    Manage Members
                  </Checkbox>
                  <Checkbox
                    onChange={(e) => setAccess(e.target.checked, "TEAMS")}
                  >
                    Manage Teams
                  </Checkbox>
                  <Checkbox
                    onChange={(e) => setAccess(e.target.checked, "CHANNELS")}
                  >
                    Manage Channels
                  </Checkbox>
                  <Checkbox
                    onChange={(e) => setAccess(e.target.checked, "CATEGORY")}
                  >
                    Manage Category Concern
                  </Checkbox>
                  <Checkbox
                    onChange={(e) => setAccess(e.target.checked, "CUSTOMERS")}
                  >
                    Manage Customers
                  </Checkbox>
                  <Text textAlign="left" fontSize="xs" p={1} color="danger">
                    {checboxError && "Please check atleast one"}
                  </Text>
                </Stack>
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

export default DrawerNewMemberComponent;
