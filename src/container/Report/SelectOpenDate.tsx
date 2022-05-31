import { FormControl, FormErrorMessage, Input } from '@chakra-ui/react';
import React from 'react';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import 'react-calendar/dist/Calendar.css';
import { IFormReports } from '../../models/interface';

interface Iprops {
  control: Control<IFormReports, object>;
  errors: FieldErrors<FieldValues>;
}

const SelectOpenDate: React.FC<Iprops> = ({ control, errors }) => {
  return (
    <FormControl isInvalid={errors?.openDate ? true : false}>
      <Controller
        control={control}
        name="openDate"
        render={({ field }) => (
          <Input
            id="openDate"
            onChange={(e) => field.onChange(e.target.value)}
            type="date"
            placeholder="open date"
            size="sm"
          />
        )}
      />

      <FormErrorMessage justifyContent="flex-end">
        {errors?.openDate?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectOpenDate;
