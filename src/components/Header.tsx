import {
  Flex,
  Heading,
  Avatar,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FaSun, FaMoon, FaBell } from 'react-icons/fa';

const Header = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const borderLine = useColorModeValue('gray.300', 'gray.700');

  let themeIcon =
    colorMode === 'light' ? <FaMoon color="#a0aec0" /> : <FaSun />;

  return (
    <Flex borderBottom="1px" borderColor={borderLine}>
      <HStack w="full" justifyContent="space-between" alignItems="center" p={3}>
        <Heading variant="solid">Logo</Heading>

        <HStack>
          <Icon
            as={FaBell}
            boxSize="5"
            color={colorMode === 'light' ? 'gray.400' : 'white'}
          />
          <IconButton
            onClick={toggleColorMode}
            size="lg"
            variant="ghost"
            aria-label="change theme"
            icon={themeIcon}
          />
          <Avatar name="Dan Abrahmov" src="https://bit.ly/dan-abramov" />
        </HStack>
      </HStack>
    </Flex>
  );
};

export default Header;
