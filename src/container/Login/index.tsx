import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { Box, Flex, Stack, Text } from '@chakra-ui/layout';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox } from '@chakra-ui/checkbox';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Icon from '@chakra-ui/icon';
import { useNavigate } from 'react-router';
import { useLoginMutation } from '../../app/features/auth-query';
import Cookies from 'js-cookie';
import { schemaLogin } from '../../models/schemas';
import { IFormInputsLogin } from '../../models/interface';
import { Image, useColorModeValue, useMediaQuery } from '@chakra-ui/react';

const Login = () => {
  const bgColor = useColorModeValue('#fff', '#1a202c');
  const [isMobile] = useMediaQuery('(max-width: 767px)');

  return (
    <Flex
      maxH="100vh"
      w="full"
      align="center"
      justifyContent="center"
      flexDirection="row"
      p={0}
    >
      <Box
        bgImage="url('./wave_background.png')"
        bgSize="35rem"
        w="32rem"
        h="33rem"
        position="absolute"
        top={-15}
        right={0}
        bgPosition="center"
        bgRepeat="no-repeat"
        zIndex="-1"
        transform="rotate(180deg)"
      />
      <Box
        bgImage="url('./card.png')"
        bgSize="52rem"
        bgPosition="center"
        bgRepeat="no-repeat"
        w="35rem"
        minH="35rem"
        p="0px"
        borderRadius="10px"
        display={isMobile ? 'none' : 'flex'}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        boxShadow="2xl"
      >
        <Text fontSize="2rem" fontWeight="bold" color="#fff">
          WELCOME!
        </Text>
        <Text fontWeight="light" color="#fff">
          One TEAM One RDF
        </Text>
        <Image
          boxSize="20rem"
          objectFit="fill"
          src="/svg_logo3.svg"
          alt="Background"
          justifySelf="center"
        />
      </Box>
      <Box
        position="relative"
        px={4}
        borderRadius="10px"
        textAlign="center"
        boxShadow="2xl"
        left={isMobile ? '0px' : '-60px'}
        zIndex="100"
        background={bgColor}
      >
        <Box p={8} zIndex="100">
          <Flex justifyContent="center">
            <Image
              w="170px"
              objectFit="fill"
              src="./ticket.svg"
              alt="rdf logo"
              mb={3}
            />
          </Flex>
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
      <Text fontSize="2rem" fontWeight="bold">
        Sign In to your Account
      </Text>
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
    formState: { errors },
  } = useForm<IFormInputsLogin>({
    mode: 'onChange',
    resolver: yupResolver(schemaLogin),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit: SubmitHandler<IFormInputsLogin> = async (data) => {
    try {
      const res = await login(data).unwrap();
      Cookies.set('token', res.accessToken);
      Cookies.set('x-refresh', res.refreshToken);
      navigate('/requester');
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
            {...register('email')}
          />
        </FormControl>
        <Text textAlign="left" fontSize="xs" p={1} color="danger">
          {errors.email?.message}
        </Text>

        <FormControl mt={3}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              isInvalid={errors.password ? true : false}
              errorBorderColor="danger"
              {...register('password')}
              autoComplete="flase"
            />
            <InputRightElement>
              <Icon
                _hover={{ cursor: 'pointer' }}
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

export default React.memo(Login);
