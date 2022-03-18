import { HStack, Icon, Text, useMediaQuery } from "@chakra-ui/react";
import React, { useContext } from "react";
import { FaEllipsisH, FaHashtag } from "react-icons/fa";
import { useParams } from "react-router-dom";
import StyleContext from "../../../context/StyleContext";
import { useGetChannelQuery } from "../../../app/features/channel-query";

const HeadingComponent: React.FC<{
  openModal: () => void;
}> = ({ openModal }) => {
  const { channelId } = useParams();
  const { borderLine } = useContext(StyleContext);
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const { data, isLoading } = useGetChannelQuery(channelId ? channelId : "");

  return (
    <HStack
      borderBottom="1px"
      borderColor={borderLine}
      p={3}
      justifyContent="space-between"
    >
      <HStack>
        <Icon as={FaHashtag} />
        <Text fontSize={isMobile ? "xs" : "xl"} fontWeight="light">
          {isLoading ? "loading channel..." : data?.name}
        </Text>
      </HStack>

      <HStack>
        <Icon as={FaEllipsisH} cursor="pointer" onClick={openModal} />
      </HStack>
    </HStack>
  );
};

export default HeadingComponent;
