import React, { useEffect, useState } from 'react';
import {
  Text,
  HStack,
  Flex,
  Stack,
  InputGroup,
  InputLeftElement,
  Radio,
  RadioGroup,
  Input,
  useMediaQuery,
  Icon,
  Button,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash, FaSearch } from 'react-icons/fa';
import { STATE, STATUS } from '../../../models/interface';

interface Props {
  setTextSearch: React.Dispatch<React.SetStateAction<string>>;
  setState: (string: STATE) => void;
  setStatus: (string: STATUS) => void;
  state: STATE;
  status: STATUS;
}

const TopNavComponent: React.FC<Props> = ({
  setTextSearch,
  setState,
  setStatus,
  state,
  status,
}) => {
  const [screenPadding, setScreenPadding] = useState<number>(4);
  const [isMobile] = useMediaQuery('(max-width: 600px)');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (isMobile === false) {
      setScreenPadding(7);
    } else {
      setScreenPadding(4);
    }
  }, [isMobile]);

  return (
    <Flex w="full" flexDirection="column" padding={screenPadding}>
      <Stack direction={['column', 'row']}>
        <HStack w="full">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<FaSearch color="gray.300" />}
            />
            <Input
              type="text"
              placeholder="search: ticket #"
              variant="filled"
              onChange={(e) => setTextSearch(e.target.value)}
            />
          </InputGroup>
        </HStack>
      </Stack>

      <Flex justifyContent="space-between" alignItems="center" mt={5}>
        {!showHistory ? (
          <Stack direction="row" spacing={3} mr={6}>
            <Text fontSize="md" color="secondAccent">
              State:
            </Text>
            <RadioGroup
              onChange={(value: STATE) => setState(value)}
              value={state}
            >
              <Stack direction="row" spacing={5}>
                <Radio value={STATE.PENDING}>Pending</Radio>
                <Radio value={STATE.DONE}>Done</Radio>
              </Stack>
            </RadioGroup>
          </Stack>
        ) : (
          <Stack direction="row" spacing={3}>
            <Text fontSize="md" color="secondAccent">
              Status:
            </Text>
            <RadioGroup
              onChange={(value: any) => setStatus(value)}
              value={status}
            >
              <Stack direction="row" spacing={5}>
                {/* <Radio value={STATUS.OPEN}>Open</Radio> */}
                <Radio value={STATUS.CLOSED}>Closed</Radio>
                <Radio value={STATUS.CANCELLED}>Cancelled</Radio>
              </Stack>
            </RadioGroup>
          </Stack>
        )}

        <Button
          size="md"
          variant="outline"
          onClick={() => setShowHistory((prev) => !prev)}
          bgColor={showHistory ? 'primary' : 'none'}
        >
          <Icon as={showHistory ? FaEye : FaEyeSlash} w={5} h={5} />
        </Button>
      </Flex>
    </Flex>
  );
};

export default TopNavComponent;
