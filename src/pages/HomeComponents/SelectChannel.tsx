import { Box, FormLabel } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { IChannel } from "../../models/interface";
import { Select, OptionBase, GroupBase } from "chakra-react-select";
import {
  Control,
  Controller,
  FieldValues,
  UseFormWatch,
} from "react-hook-form";

const SelectChannel: React.FC<{
  control: Control<FieldValues, object>;
  channels: Array<Pick<IChannel, "name" | "_id" | "isActive">>;
}> = ({ channels, control }) => {
  return (
    <Box>
      <FormLabel htmlFor="channel" fontSize="sm" color="gray.400">
        Channel
      </FormLabel>

      <Controller
        control={control}
        name="channelId"
        render={({ field }) => (
          <Select
            {...field}
            escapeClearsValue={true}
            selectedOptionStyle="color"
            placeholder={
              channels.length > 0 ? "select channel" : "no item found"
            }
            options={channels.map(function (channel) {
              return { value: channel._id, label: channel.name };
            })}
            selectedOptionColor="purple"
            isClearable={true}
          />
        )}
      />
    </Box>
  );
};

export default SelectChannel;
