import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Select } from 'chakra-react-select';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormGetValues,
} from 'react-hook-form';
import { useListSubCategoryQuery } from '../../app/features/category-query';

const SelectSubUnit: React.FC<{
  control: Control<FieldValues, object>;
  errors: FieldErrors<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
}> = ({ control, errors, getValues }) => {
  const [page] = useState<number>(1);
  const [searchText] = useState<string>('');
  const [categoryId, setCategoryId] = useState('');

  const { data } = useListSubCategoryQuery({
    page: page,
    limit: 1000,
    search: searchText,
    status: true,
    categoryId,
  });

  useEffect(() => {
    if (getValues('categoryId')) {
      let id = getValues('categoryId');
      setCategoryId(id);
    }
  }, [getValues('categoryId')]);

  return (
    <FormControl isInvalid={errors?.SubCategoryId ? true : false}>
      <FormLabel htmlFor="SubCategoryId" fontSize="sm" color="gray.400">
        Sub Category
      </FormLabel>
      <Controller
        control={control}
        name="SubCategoryId"
        render={({ field }) => (
          <Select
            id="SubCategoryId"
            onChange={(e) =>
              field.onChange(
                e.map((i) => {
                  return i.value;
                })
              )
            }
            selectedOptionStyle="color"
            placeholder="Select Sub-category"
            options={data?.docs.map(function (customer) {
              return { value: customer._id, label: customer.name };
            })}
            selectedOptionColor="purple"
            isClearable={true}
            isMulti={true}
          />
        )}
      />
      <FormErrorMessage justifyContent="flex-end">
        {errors?.SubCategoryId?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectSubUnit;
