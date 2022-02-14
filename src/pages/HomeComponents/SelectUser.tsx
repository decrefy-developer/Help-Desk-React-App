import { Box, FormLabel } from "@chakra-ui/react";
import React from "react";
import { Select } from "chakra-react-select";
import { useGetChannelQuery } from "../../features/channel-query";
import {
  Control,
  Controller,
  FieldValues,
  UseFormWatch,
} from "react-hook-form";

const SelectUser: React.FC<{
  control: Control<FieldValues, object>;
  watch: UseFormWatch<FieldValues>;
}> = ({ control, watch }) => {
  const channelId = watch("channelId");
  const { data } = useGetChannelQuery(channelId);

  return (
    <Box>
      <FormLabel htmlFor="userId" fontSize="sm" color="gray.400">
        Assign User
      </FormLabel>

      <Controller
        control={control}
        name="userId"
        render={({ field }) => (
          <Select
            id="userId"
            onChange={(e) => field.onChange(e?.value)}
            selectedOptionStyle="color"
            placeholder={
              data?.members !== undefined && data?.members.length > 0
                ? "Select Concern"
                : "no items found"
            }
            options={data?.members.map(function (member) {
              return { value: member.userId, label: member.email };
            })}
            selectedOptionColor="purple"
            isClearable={true}
          />
        )}
      />
    </Box>
  );
};

export default SelectUser;
