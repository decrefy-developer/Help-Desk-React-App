import { FormControl } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { IFormReports } from "../../models/interface";

interface IProps {
  control: Control<IFormReports, object>;
}
const SelectStatus: React.FC<IProps> = ({ control }) => {
  const options = [
    { value: "OPEN", label: "OPEN", colorScheme: "red" },
    { value: "CLOSED", label: "CLOSED" },
    { value: "CANCELLED", label: "CANCELLED" },
  ];

  return (
    <FormControl>
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select
            id="status"
            onChange={(e) => field.onChange(e?.value)}
            selectedOptionColor="purple"
            placeholder="Select Ticket Status"
            options={options}
            selectedOptionStyle="color"
            isClearable={true}
            size="sm"
          />
        )}
      />
    </FormControl>
  );
};

export default SelectStatus;
