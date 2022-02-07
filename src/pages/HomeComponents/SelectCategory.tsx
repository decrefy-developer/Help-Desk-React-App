import { Box, FormLabel } from "@chakra-ui/react";
import React, { useState } from "react";
import { Select } from "chakra-react-select";
import { useListCategoryConcernQuery } from "../../features/category-query";
import { Control, Controller, FieldValues } from "react-hook-form";

const SelectCategory: React.FC<{
  control: Control<FieldValues, object>;
}> = ({ control }) => {
  const [page, setPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const { data } = useListCategoryConcernQuery({
    page: page,
    limit: 100,
    search: searchText,
    status: true,
  });

  return (
    <Box>
      <FormLabel htmlFor="channel" fontSize="sm" color="gray.400">
        Major Category Concern
      </FormLabel>
      <Controller
        control={control}
        name="categoryId"
        render={({ field }) => (
          <Select
            {...field}
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
    </Box>
  );
};

export default SelectCategory;
