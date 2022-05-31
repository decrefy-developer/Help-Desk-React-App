import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import { Select } from 'chakra-react-select';
import { useListDepartmentQuery } from '../../app/features/department-query';

interface IProps {
  control: Control<FieldValues, object>;
  errors: FieldErrors<FieldValues>;
}

const SelectDepartment: React.FC<IProps> = ({ control, errors }) => {
  const [page] = useState<number>(1);
  const { data, isFetching } = useListDepartmentQuery({
    page: page,
    limit: 10000,
    search: '',
    status: true,
  });

  return (
    <FormControl isInvalid={errors?.departmentId ? true : false}>
      <HStack justifyContent="space-between" alignItems="center">
        <FormLabel htmlFor="departmentId" fontSize="sm" color="gray.400">
          Department
        </FormLabel>
      </HStack>

      <Controller
        control={control}
        name="departmentId"
        render={({ field }) => (
          <Select
            id="departmentId"
            isLoading={isFetching}
            onChange={(e) => field.onChange(e?.value)}
            selectedOptionStyle="color"
            placeholder="Select Team"
            options={data?.docs.map(function (department) {
              return { value: department._id, label: department.name };
            })}
            selectedOptionColor="purple"
            isClearable={true}
          />
        )}
      />
      <FormErrorMessage justifyContent="flex-end">
        {errors?.departmentId?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectDepartment;
