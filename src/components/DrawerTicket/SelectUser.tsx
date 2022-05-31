import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import React from 'react';
import { Select } from 'chakra-react-select';
import { useGetChannelQuery } from '../../app/features/channel-query';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormWatch,
} from 'react-hook-form';

const SelectUser: React.FC<{
  control: Control<FieldValues, object>;
  watch: UseFormWatch<FieldValues>;
  errors: FieldErrors<FieldValues>;
}> = ({ control, watch, errors }) => {
  const channelId = watch('channelId');
  const { data, isLoading } = useGetChannelQuery(channelId);

  return (
    <FormControl isInvalid={errors?.userId ? true : false}>
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
                ? 'Select Concern'
                : 'no items found'
            }
            options={data?.members.map(function (member) {
              return { value: member.userId, label: member.email };
            })}
            selectedOptionColor="purple"
            isClearable={true}
            isLoading={isLoading}
          />
        )}
      />
      <FormErrorMessage justifyContent="flex-end">
        {errors?.userId?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectUser;
