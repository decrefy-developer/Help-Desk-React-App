import { Box, FormLabel } from "@chakra-ui/react";
import React from "react";
import { Select } from "chakra-react-select";
import { useGetChannelQuery } from "../../features/channel-query";
import {
  Control,
  Controller,
  FieldValues,
  UseFormGetValues,
  UseFormWatch,
} from "react-hook-form";

const SelectCoworker: React.FC<{
  control: Control<FieldValues, object>;
  getValues: UseFormGetValues<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}> = ({ control, getValues, watch }) => {
  const channelId = watch("channelId");
  const { data } = useGetChannelQuery(channelId);

  return (
    <Box>
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
            options={data?.members.map(function (member) {
              return { value: member._id, label: member.email };
            })}
            selectedOptionColor="purple"
            isClearable={true}
          />
        )}
      />
    </Box>
  );
};

export default SelectCoworker;
