import { Box, FormLabel, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import DatePicker from "react-date-picker";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

const dateNow = moment().format("YYYY-MM-DD"); // this is just to disables previews date

const SelectStartDate: React.FC<{
  control: Control<FieldValues, object>;
}> = ({ control }) => {
  return (
    <Box>
      <FormLabel htmlFor="channel" fontSize="sm" color="gray.400">
        Start Date
      </FormLabel>

      <Controller
        control={control}
        name="startDate"
        render={({ field: { onChange } }) => (
          <Input onChange={onChange} type="date" min={dateNow} />
        )}
      />
    </Box>
  );
};

export default SelectStartDate;
