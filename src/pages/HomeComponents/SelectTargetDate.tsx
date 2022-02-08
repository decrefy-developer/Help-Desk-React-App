import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";

const dateNow = moment().format("YYYY-MM-DD"); // th

const SelectTargetDate: React.FC<{
  control: Control<FieldValues, object>;
  errors: FieldErrors<FieldValues>;
}> = ({ control, errors }) => {
  return (
    <FormControl isInvalid={errors?.targetDate ? true : false}>
      <FormLabel htmlFor="targetDate" fontSize="sm" color="gray.400">
        Target Date
      </FormLabel>

      <Controller
        control={control}
        name="targetDate"
        render={({ field: { onChange } }) => (
          <Input
            id="targetDate"
            onChange={onChange}
            type="datetime-local"
            min={dateNow}
          />
        )}
      />
      <FormErrorMessage justifyContent="flex-end">
        {errors?.targetDate?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectTargetDate;
