import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useListChannelQuery } from "../../app/features/channel-query";

interface Props {
  errors: Array<string>;
  setChannel: React.Dispatch<React.SetStateAction<string>>;
  team: string;
}

const SelectChannel: React.FC<Props> = ({ errors, setChannel, team }) => {
  const [options, setOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const { data, isFetching } = useListChannelQuery({
    page: 1,
    limit: 1000,
    search: "",
    status: true,
  });

  const onChangeHandler = (e: any) => {
    if (e) setChannel(e.value);
  };

  useEffect(() => {
    if (!isFetching) {
      const selectedTeam = data?.docs
        .filter((item) => item.team["_id"] === team)
        .map((res) => {
          return { value: res._id, label: res.name };
        });
      if (selectedTeam) setOptions(selectedTeam);
    }
  }, [team]);

  return (
    <FormControl isInvalid={errors.includes("team")}>
      <Select
        id="team"
        isLoading={isFetching}
        onChange={(e) => onChangeHandler(e)}
        selectedOptionStyle="color"
        placeholder="Select Team"
        options={options}
        selectedOptionColor="purple"
        isClearable={true}
      />

      <FormErrorMessage justifyContent="flex-end">
        {`sample error`}
      </FormErrorMessage>
    </FormControl>
  );
};

export default SelectChannel;
