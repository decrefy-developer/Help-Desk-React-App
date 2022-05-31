import React, { useEffect } from 'react';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useListTeamQuery } from '../../app/features/team-query';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormGetValues,
  UseFormWatch,
} from 'react-hook-form';
import { IChannel, IFormReports } from '../../models/interface';

interface Props {
  control: Control<IFormReports, object>;
  page?: number;
  errors: FieldErrors<FieldValues>;
  setChannel: React.Dispatch<
    React.SetStateAction<Pick<IChannel, 'name' | '_id'>[]>
  >;
  getValueTeam: UseFormGetValues<IFormReports>;
  watch: UseFormWatch<IFormReports>;
}

const SelectTeam: React.FC<Props> = ({
  page = 1,
  errors,
  control,
  setChannel,
  getValueTeam,
  watch,
}) => {
  const { data, isFetching, isError } = useListTeamQuery({
    page: page,
    limit: 1000,
    search: '',
    status: true,
  });

  useEffect(() => {
    if (getValueTeam('team')) {
      let teamId = getValueTeam('team');

      if (teamId === 'All') return setChannel([{ _id: 'All', name: 'All' }]);

      const selectedTeam = data?.docs.filter((team) => team._id === teamId);
      if (selectedTeam) setChannel(selectedTeam[0].channels);
    }
  }, [watch('team')]);

  let options = data?.docs.map(function (team) {
    return { value: team._id, label: team.name };
  });

  useEffect(() => {
    const checkError = () => {
      if (isError)
        return alert('An error has occurred!, please refresh the page');
    };

    checkError();
  }, [isError]);

  return (
    <FormControl isInvalid={errors?.team ? true : false}>
      <Controller
        name="team"
        control={control}
        render={({ field }) => (
          <Select
            id="team"
            isLoading={isFetching}
            onChange={(e) => field.onChange(e?.value)}
            selectedOptionStyle="color"
            placeholder="Select Team"
            options={options && [{ value: 'All', label: 'All' }, ...options]}
            selectedOptionColor="purple"
            isClearable={true}
            size="sm"
          />
        )}
      />

      <FormErrorMessage justifyContent="flex-end">
        {errors?.team?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectTeam;
