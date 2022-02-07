import { Box, FormLabel, Textarea } from "@chakra-ui/react";
import React from "react";

const TextAreaConcern = () => {
  return (
    <Box>
      <FormLabel htmlFor="channel" fontSize="sm" color="gray.400">
        Concern Details
      </FormLabel>
      <Textarea
        focusBorderColor="purple.500"
        placeholder="ex: I can't login my account"
        size="sm"
      />
    </Box>
  );
};

export default TextAreaConcern;
