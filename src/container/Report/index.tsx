import { Box, Button, Flex, Heading, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import SelectChannel from "./SelectChannel";
import SelectTeam from "./SelectTeam";

const Report = () => {
  const [team, setTeam] = useState<string>("");
  const [channel, setChannel] = useState<string>("");
  const [errors, setErrors] = useState<Array<string>>([]);

  return (
    <>
      <Flex w="full" flexDirection="column">
        <Box p={4}>
          <Heading fontSize="xl">Generate Reports</Heading>
        </Box>
        <Stack
          w="full"
          direction={["column", "column", "row"]}
          borderBottom="1px"
          borderColor="gray.700"
          p={4}
        >
          <SelectTeam errors={errors} setTeam={setTeam} />
          <SelectChannel errors={errors} setChannel={setChannel} team={team} />
          <Button>Submit</Button>
        </Stack>
      </Flex>
    </>
  );
};

export default Report;
