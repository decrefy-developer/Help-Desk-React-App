import {
  Box,
  Button,
  CircularProgress,
  FormLabel,
  HStack,
  Icon,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  Control,
  Controller,
  FieldValues,
  UseFormWatch,
} from "react-hook-form";
import { FaAngleLeft, FaAngleRight, FaCaretDown } from "react-icons/fa";
import { useListTeamQuery } from "../../features/team-query";
import { IChannel } from "../../models/interface";
import { Select } from "chakra-react-select";

const SelectTeam: React.FC<{
  control: Control<FieldValues, object>;
  setChannel: React.Dispatch<
    React.SetStateAction<Array<Pick<IChannel, "name" | "_id" | "isActive">>>
  >;
  watch: UseFormWatch<FieldValues>;
}> = ({ control, setChannel, watch }) => {
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
    if (watch("teamId")) {
      let teamId = watch("teamId");
      const selectedTeam = data?.docs.filter(
        (team) => team._id === teamId.value
      );

      if (selectedTeam) setChannel(selectedTeam[0].channels);
    }
  }, [watch("teamId")]);

  return (
    <Box>
      <HStack justifyContent="space-between" alignItems="center">
        <FormLabel htmlFor="Team" fontSize="sm" color="gray.400">
          Team
        </FormLabel>

        {isFetching && (
          <CircularProgress isIndeterminate color="primary" size="20px" />
        )}
      </HStack>

      <Controller
        control={control}
        name="teamId"
        render={({ field }) => (
          <Select
            {...field}
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
    </Box>
  );
};

export default SelectTeam;
