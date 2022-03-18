import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import React from "react";
import { Select } from "chakra-react-select";
import { useGetChannelQuery } from "../../app/features/channel-query";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormWatch,
} from "react-hook-form";

const SelectCoworker: React.FC<{
  control: Control<FieldValues, object>;
  watch: UseFormWatch<FieldValues>;
  errors: FieldErrors<FieldValues>;
}> = ({ control, watch, errors }) => {
  const channelId = watch("channelId");
  const user = watch("userId");
  const { data } = useGetChannelQuery(channelId);

  return (
    <FormControl isInvalid={errors?.coworkers ? true : false}>
      <FormLabel htmlFor="coworkers" fontSize="sm" color="gray.400">
        Co-workers
      </FormLabel>

      <Controller
        control={control}
        name="coworkers"
        render={({ field }) => (
          <Select
            id="coworkers"
            onChange={(e) =>
              field.onChange(
                e.map((item) => {
                  return item.value;
                })
              )
            }
            isMulti
            colorScheme="purple"
            selectedOptionStyle="check"
            placeholder={
              data?.members !== undefined && data?.members.length > 0
                ? "Select Concern"
                : "no items found"
            }
            options={data?.members
              .filter((member) => member.userId !== user)
              .map((item) => {
                return {
                  value: item.userId,
                  label: item.email,
                };
              })}
            selectedOptionColor="purple"
            isClearable={true}
          />
        )}
      />
      <FormErrorMessage justifyContent="flex-end">
        {errors?.coworkers?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectCoworker;
