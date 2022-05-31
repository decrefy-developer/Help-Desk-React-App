import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import React, { useState } from 'react';
import { Select } from 'chakra-react-select';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import { useListCategoryConcernQuery } from '../../app/features/category-query';

const SelectCategory: React.FC<{
  control: Control<FieldValues, object>;
  errors: FieldErrors<FieldValues>;
}> = ({ control, errors }) => {
  const [page] = useState<number>(1);
  const [searchText] = useState<string>('');
  const { data } = useListCategoryConcernQuery({
    page: page,
    limit: 1000,
    search: searchText,
    status: true,
  });

  return (
    <FormControl isInvalid={errors?.categoryId ? true : false}>
      <FormLabel htmlFor="categoryId" fontSize="sm" color="gray.400">
        Major Category Concern
      </FormLabel>
      <Controller
        control={control}
        name="categoryId"
        render={({ field }) => (
          <Select
            id="categoryId"
            onChange={(e) => field.onChange(e?.value)}
            selectedOptionStyle="color"
            placeholder="Select Concern"
            options={data?.docs.map(function (customer) {
              return { value: customer._id, label: customer.name };
            })}
            selectedOptionColor="purple"
            isClearable={true}
          />
        )}
      />
      <FormErrorMessage justifyContent="flex-end">
        {errors?.categoryId?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectCategory;
