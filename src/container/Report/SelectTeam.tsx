import React from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useListTeamQuery } from "../../app/features/team-query";

interface Props {
  page?: number;
  errors: Array<string>;
  setTeam: React.Dispatch<React.SetStateAction<string>>;
}

const SelectTeam: React.FC<Props> = ({ page = 1, errors, setTeam }) => {
  const { data, isFetching } = useListTeamQuery({
    page: page,
    limit: 1000,
    search: "",
    status: true,
  });

  const onChangeHandler = (e: any) => {
    if (e) setTeam(e.value);
  };

  return (
    <FormControl isInvalid={errors.includes("team")}>
      <Select
        id="team"
        isLoading={isFetching}
        onChange={(e) => onChangeHandler(e)}
        selectedOptionStyle="color"
        placeholder="Select Team"
        options={data?.docs.map(function (team) {
          return { value: team._id, label: team.name };
        })}
        selectedOptionColor="purple"
        isClearable={true}
      />

      <FormErrorMessage justifyContent="flex-end">
        {`sample error`}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectTeam;
