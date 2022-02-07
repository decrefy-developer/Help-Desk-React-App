import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/layout";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox } from "@chakra-ui/checkbox";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Icon from "@chakra-ui/icon";
import { useNavigate } from "react-router";
import { useLoginMutation } from "../features/auth-query";
import Cookies from "js-cookie";
import { schemaLogin } from "../models/schemas";
import { IFormInputsLogin } from "../models/interface";

const LoginPage = () => {
  return (
    <Flex minH="100vh" w="full" align="center" justifyContent="center">
      <Box
        borderWidth={1}
        px={4}
        borderRadius={4}
        textAlign="center"
        boxShadow="lg"
      >
        <Box p={8}>
          <LoginHeader />
          <LoginForm />
        </Box>
      </Box>
    </Flex>
  );
};

const LoginHeader = () => {
  return (
    <Box>
      <Heading>Sign In to your Account</Heading>
      <Text color="gray.300">Management Information System</Text>
    </Box>
  );
};

const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid, isDirty },
  } = useForm<IFormInputsLogin>({
    mode: "onChange",
    resolver: yupResolver(schemaLogin),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<IFormInputsLogin> = async (data) => {
    try {
      const res = await login(data).unwrap();
      Cookies.set("token", res.accessToken);
      Cookies.set("x-refresh", res.refreshToken);
      navigate("/home");
    } catch (err: any) {
      toast.error(err.data);
    }
  };

  const showPasswordHandler = () => setShowPassword(!showPassword);

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mt={3}>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email address"
            isInvalid={errors.email ? true : false}
            errorBorderColor="danger"
            autoComplete="off"
            {...register("email")}
          />
        </FormControl>
        <Text textAlign="left" fontSize="xs" p={1} color="danger">
          {errors.email?.message}
        </Text>

        <FormControl mt={3}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              isInvalid={errors.password ? true : false}
              errorBorderColor="danger"
              {...register("password")}
              autoComplete="flase"
            />
            <InputRightElement>
              <Icon
                _hover={{ cursor: "pointer" }}
                as={showPassword ? FaEyeSlash : FaEye}
                onClick={showPasswordHandler}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Text textAlign="left" fontSize="xs" p={1} color="danger">
          {errors.password?.message}
        </Text>

        <Stack mt={2}>
          <Box textAlign="left">
            <Checkbox>Remember me</Checkbox>
          </Box>
          <Box>
            <Button
              bg="primary"
              isLoading={isLoading}
              disabled={!isDirty || !isValid}
              w="full"
              mt={4}
              type="submit"
            >
              Sign In
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export default React.memo(LoginPage);
