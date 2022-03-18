import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React from "react";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

const dateNow = moment().format("YYYY-MM-DD"); // this is just to disables previews date

const SelectStartDate: React.FC<{
  control: Control<FieldValues, object>;
  errors: FieldErrors<FieldValues>;
}> = ({ control, errors }) => {
  return (
    <FormControl isInvalid={errors?.startDate ? true : false}>
      <FormLabel htmlFor="startDate" fontSize="sm" color="gray.400">
        Start Date
      </FormLabel>

      <Controller
        control={control}
        name="startDate"
        render={({ field: { onChange } }) => (
          <Input
            id="startDate"
            onChange={onChange}
            type="datetime-local"
            min={dateNow}
          />
        )}
      />
      <FormErrorMessage justifyContent="flex-end">
        {errors?.startDate?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectStartDate;
