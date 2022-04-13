import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React from "react";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";

const InputRequester: React.FC<{
  control: Control<FieldValues, object>;
  errors: FieldErrors<FieldValues>;
}> = ({ control, errors }) => {
  return (
    <FormControl isInvalid={errors?.requesterName ? true : false}>
      <FormLabel htmlFor="requesterName" fontSize="sm" color="gray.400">
        Requester Name
      </FormLabel>

      <Controller
        control={control}
        name="requesterName"
        render={({ field: { onChange, value } }) => (
          <Input placeholder="Jose Rizal" onChange={onChange} value={value} />
        )}
      />
      <FormErrorMessage justifyContent="flex-end">
        {errors?.requesterName?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default InputRequester;
