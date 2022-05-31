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
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Select } from 'chakra-react-select';
import { useRef, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  useListDepartmentQuery,
  useListUnitQuery,
} from '../../app/features/department-query';
import { useAddMemberMutation } from '../../app/features/member-query';
import { ACCESS, IFormInputMember } from '../../models/interface';
import { schemaAccount } from '../../models/schemas';
// import Socket from "../../services/Socket";

const DrawerComponent: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const firstField = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [checkedAccess, setCheckedAccess] = useState<Array<string>>([]);
  const [checboxError] = useState(false);
  const [addMember, { isLoading }] = useAddMemberMutation();

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<IFormInputMember>({
    mode: 'onChange',
    resolver: yupResolver(schemaAccount),
    // defaultValues: {
    //   firstName: "",
    //   lastName: "",
    //   departmentId: "",
    //   unitId: "",
    //   email: " ",
    //   password: "",
    //   confirmPassword: "",
    //   priviledge: [],
    // },
  });

  const { data: departments, isLoading: departmentLoading } =
    useListDepartmentQuery({
      page: 1,
      limit: 10000,
      search: '',
      status: true,
    });

  const { data: units, isFetching: unitsLoading } = useListUnitQuery({
    page: 1,
    limit: 10000,
    search: '',
    status: true,
    departmentId: watch('departmentId'),
  });

  const onSubmit: SubmitHandler<IFormInputMember> = async (data) => {
    try {
      data.priviledge = checkedAccess;

      const result = await addMember(data).unwrap();
      if (result) {
        onClose();
        reset();
        toast.success(`${result.email} has been successfully added`);
      }
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
              <FormControl isInvalid={errors?.firstName ? true : false}>
                <FormLabel htmlFor="fname" fontSize="sm" color="gray.400">
                  First name
                </FormLabel>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fname"
                      autoComplete="off"
                      onChange={field.onChange}
                      placeholder="Please enter first name"
                    />
                  )}
                />
                <FormErrorMessage justifyContent="flex-end">
                  {errors?.firstName?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors?.lastName ? true : false}>
                <FormLabel htmlFor="lname" fontSize="sm" color="gray.400">
                  Last name
                </FormLabel>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="lname"
                      autoComplete="off"
                      onChange={field.onChange}
                      placeholder="Please enter last name"
                    />
                  )}
                />
                <FormErrorMessage justifyContent="flex-end">
                  {errors?.lastName?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors?.departmentId ? true : false}>
                <FormLabel htmlFor="department" fontSize="sm" color="gray.400">
                  Department
                </FormLabel>
                <Controller
                  name="departmentId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="department"
                      onChange={(e) => field.onChange(e?.value)}
                      placeholder="Select Department"
                      selectedOptionStyle="color"
                      options={departments?.docs.map(function (dept) {
                        return { value: dept._id, label: dept.name };
                      })}
                      selectedOptionColor="purple"
                      isClearable={true}
                      isLoading={departmentLoading}
                    />
                  )}
                />
                <FormErrorMessage justifyContent="flex-end">
                  {errors?.departmentId?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors?.unitId ? true : false}>
                <FormLabel htmlFor="unit" fontSize="sm" color="gray.400">
                  Unit
                </FormLabel>
                <Controller
                  name="unitId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="unit"
                      onChange={(e) => field.onChange(e?.value)}
                      placeholder="Select Unit"
                      selectedOptionStyle="color"
                      options={units?.docs.map(function (unit) {
                        return { value: unit._id, label: unit.name };
                      })}
                      selectedOptionColor="purple"
                      isClearable={true}
                      isLoading={unitsLoading}
                    />
                  )}
                />
                <FormErrorMessage justifyContent="flex-end">
                  {errors?.unitId?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors?.email ? true : false}>
                <FormLabel htmlFor="email" fontSize="sm" color="gray.400">
                  Email
                </FormLabel>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="email"
                      autoComplete="flase"
                      id="email"
                      placeholder="Please enter email"
                      onChange={field.onChange}
                    />
                  )}
                />
                <FormErrorMessage justifyContent="flex-end">
                  {errors?.email?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors?.password ? true : false}>
                <FormLabel htmlFor="password" fontSize="sm" color="gray.400">
                  Password
                </FormLabel>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <InputGroup>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="flase"
                        id="password"
                        placeholder="Please enter password"
                        onChange={field.onChange}
                      />
                      <InputRightElement
                        children={showPassword ? <FaEyeSlash /> : <FaEye />}
                        cursor="pointer"
                        onClick={showPasswordHandler}
                      />
                    </InputGroup>
                  )}
                />
                <FormErrorMessage justifyContent="flex-end">
                  {errors?.password?.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors?.confirmPassword ? true : false}>
                <FormLabel
                  htmlFor="confirmPassword"
                  fontSize="sm"
                  color="gray.400"
                >
                  Confirm-password
                </FormLabel>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="password"
                      autoComplete="flase"
                      id="confirmPassword"
                      placeholder="Please enter confirm-password"
                      onChange={field.onChange}
                    />
                  )}
                />
                <FormErrorMessage justifyContent="flex-end">
                  {errors?.confirmPassword?.message}
                </FormErrorMessage>
              </FormControl>

              <Box>
                <Stack spacing={2}>
                  <FormLabel fontSize="sm" color="gray.400">
                    Access
                  </FormLabel>
                  <Checkbox
                    onChange={(e) =>
                      setAccess(e.target.checked, ACCESS.CREATE_TICKET)
                    }
                  >
                    Create Ticket
                  </Checkbox>

                  <Checkbox
                    onChange={(e) =>
                      setAccess(e.target.checked, ACCESS.REQUESTER)
                    }
                  >
                    Requester
                  </Checkbox>

                  <Checkbox
                    onChange={(e) =>
                      setAccess(e.target.checked, ACCESS.SUPPORT)
                    }
                  >
                    Support
                  </Checkbox>

                  <Checkbox
                    onChange={(e) =>
                      setAccess(e.target.checked, ACCESS.DEPARTMENT)
                    }
                  >
                    Manage Department
                  </Checkbox>

                  <Checkbox
                    onChange={(e) =>
                      setAccess(e.target.checked, ACCESS.MEMBERS)
                    }
                  >
                    Manage Members
                  </Checkbox>

                  <Checkbox
                    onChange={(e) => setAccess(e.target.checked, ACCESS.TEAMS)}
                  >
                    Manage Teams
                  </Checkbox>
                  <Checkbox
                    onChange={(e) =>
                      setAccess(e.target.checked, ACCESS.CHANNELS)
                    }
                  >
                    Manage Channels
                  </Checkbox>
                  <Checkbox
                    onChange={(e) =>
                      setAccess(e.target.checked, ACCESS.CATEGORY)
                    }
                  >
                    Manage Category Concern
                  </Checkbox>

                  <Text textAlign="left" fontSize="xs" p={1} color="danger">
                    {checboxError && 'Please check atleast one'}
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

export default DrawerComponent;
