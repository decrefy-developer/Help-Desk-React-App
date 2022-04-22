import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
} from "@chakra-ui/react";
import React from "react";

interface IProps {
  buttonTitle: string;
  headerTitle: string;
  print_SS: () => void;
  print_HM: () => void;
  print_SI: () => void;
  print_PM: () => void;
}

const PopOver: React.FC<IProps> = ({
  buttonTitle,
  headerTitle,
  print_HM,
  print_SS,
  print_SI,
  print_PM,
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button>{buttonTitle}</Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>{headerTitle}</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Stack direction="row">
              <Button colorScheme="purple" onClick={print_SS}>
                SS
              </Button>
              <Button colorScheme="purple" onClick={print_HM}>
                HM
              </Button>
              <Button colorScheme="purple" onClick={print_SI}>
                SI
              </Button>
              <Button colorScheme="purple" onClick={print_PM}>
                PM
              </Button>
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default PopOver;
