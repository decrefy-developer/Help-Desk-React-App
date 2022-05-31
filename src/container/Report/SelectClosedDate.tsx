import { FormControl, FormErrorMessage, Input } from '@chakra-ui/react';
import React from 'react';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import 'react-calendar/dist/Calendar.css';
import { IFormReports } from '../../models/interface';

interface IProps {
  control: Control<IFormReports, object>;
  errors: FieldErrors<FieldValues>;
}

const SelectClosedDate: React.FC<IProps> = ({ control, errors }) => {
  return (
    <FormControl isInvalid={errors?.closedDate ? true : false}>
      <Controller
        control={control}
        name="closedDate"
        render={({ field }) => (
          <Input
            id="closedDate"
            onChange={(e) => field.onChange(e.target.value)}
            type="date"
            size="sm"
          />
        )}
      />
      <FormErrorMessage justifyContent="flex-end">
        {errors?.closedDate?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectClosedDate;
