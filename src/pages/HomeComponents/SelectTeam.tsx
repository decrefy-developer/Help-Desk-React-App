import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormGetValues,
} from "react-hook-form";
import { useListTeamQuery } from "../../features/team-query";
import { Select } from "chakra-react-select";
import { IChannel } from "../../models/interface";

const SelectTeam: React.FC<{
  control: Control<FieldValues, object>;
  errors: FieldErrors<FieldValues>;
  getValues: UseFormGetValues<FieldValues>;
  setChannel: React.Dispatch<
    React.SetStateAction<Pick<IChannel, "name" | "_id" | "isActive">[]>
  >;
}> = ({ control, errors, getValues, setChannel }) => {
  const [page, setPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>("");
  const { data, isError, isFetching } = useListTeamQuery({
    page: page,
    limit: 1000,
    search: searchText,
    status: true,
  });

  const handleScrollBottom = () => {
    const nextPage = data?.nextPage;
    if (data?.hasNextPage) setPage(Number(nextPage));
  };

  const handleSrollTop = () => {
    const prevPage = data?.prevPage;
    if (data?.hasPrevPage) setPage(Number(prevPage));
  };

  useEffect(() => {
    if (getValues("teamId")) {
      let teamId = getValues("teamId");

      const selectedTeam = data?.docs.filter((team) => team._id === teamId);
      if (selectedTeam) setChannel(selectedTeam[0].channels);
    }
  }, [getValues("teamId")]);

  return (
    <FormControl isInvalid={errors?.teamId ? true : false}>
      <HStack justifyContent="space-between" alignItems="center">
        <FormLabel htmlFor="teamId" fontSize="sm" color="gray.400">
          Team
        </FormLabel>
      </HStack>

      <Controller
        control={control}
        name="teamId"
        render={({ field }) => (
          <Select
            id="teamId"
            isLoading={isFetching}
            onChange={(e) => field.onChange(e?.value)}
            onMenuScrollToBottom={handleScrollBottom}
            onMenuScrollToTop={handleSrollTop}
            selectedOptionStyle="color"
            placeholder="Select Team"
            options={data?.docs.map(function (team) {
              return { value: team._id, label: team.name };
            })}
            selectedOptionColor="purple"
            isClearable={true}
          />
        )}
      />
      <FormErrorMessage justifyContent="flex-end">
        {errors?.teamId?.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectTeam;
