import React, { useEffect, useState } from 'react';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import { IChannel, IFormReports } from '../../models/interface';

interface Props {
  errors: FieldErrors<FieldValues>;
  control: Control<IFormReports, object>;
  channels: Array<Pick<IChannel, '_id' | 'name'>>;
}

const SelectChannel: React.FC<Props> = ({ errors, control, channels }) => {
  const [options, setOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  useEffect(() => {
    const valueHolder = channels.map((channel) => {
      return {
        value: channel._id,
        label: channel.name,
      };
    });
    setOptions(valueHolder);
  }, [channels]);

  return (
    <FormControl isInvalid={false}>
      <Controller
        name="channel"
        control={control}
        render={({ field }) => (
          <Select
            onChange={(e) => field.onChange(e?.value)}
            selectedOptionStyle="color"
            placeholder="Select Channel"
            options={options}
            selectedOptionColor="purple"
            isClearable={true}
            size="sm"
          />
        )}
      />

      <FormErrorMessage justifyContent="flex-end">
        {errors?.channel?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectChannel;
