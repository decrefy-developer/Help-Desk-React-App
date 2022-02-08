import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import React, { useState } from "react";
import { Select } from "chakra-react-select";
import { useListCustomerQuery } from "../../features/customer-query";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";

const SelectCustomer: React.FC<{
  control: Control<FieldValues, object>;
  errors: FieldErrors<FieldValues>;
}> = ({ control, errors }) => {
  const [page, setPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const { data } = useListCustomerQuery({
    page: page,
    limit: 100,
    search: searchText,
    status: true,
  });

  return (
    <FormControl isInvalid={errors?.customerId ? true : false}>
      <FormLabel htmlFor="customerId" fontSize="sm" color="gray.400">
        Customer
      </FormLabel>
      <Controller
        control={control}
        name="customerId"
        render={({ field }) => (
          <Select
            id="customerId"
            onChange={(e) => field.onChange(e?.value)}
            selectedOptionStyle="color"
            placeholder="Select Customer"
            options={data?.docs.map(function (customer) {
              return { value: customer._id, label: customer.name };
            })}
            selectedOptionColor="purple"
            isClearable={true}
          />
        )}
      />
      <FormErrorMessage justifyContent="flex-end">
        {errors?.customerId?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectCustomer;
