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

const SelectOpenDate = () => {
  return (
    <FormControl isInvalid={false}>
      <FormLabel htmlFor="openDate" fontSize="sm" color="gray.400">
        Closed Date
      </FormLabel>
      <Input
        id="openDate"
        onChange={(e) => console.log(e.target.value)}
        type="date"
        min={dateNow}
      />
      <FormErrorMessage justifyContent="flex-end">{`This`}</FormErrorMessage>
    </FormControl>
  );
};

export default SelectOpenDate;
