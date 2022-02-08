import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";

const TextAreaConcern: React.FC<{
  control: Control<FieldValues, object>;
  errors: FieldErrors<FieldValues>;
}> = ({ control, errors }) => {
  return (
    <FormControl isInvalid={errors?.description ? true : false}>
      <FormLabel htmlFor="description" fontSize="sm" color="gray.400">
        Concern Details
      </FormLabel>
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <Textarea
            {...field}
            id="description"
            focusBorderColor="purple.500"
            placeholder="ex: I can't login my account"
            size="sm"
            height="200px"
          />
        )}
      />
      <FormErrorMessage justifyContent="flex-end">
        {errors?.description?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default TextAreaConcern;
