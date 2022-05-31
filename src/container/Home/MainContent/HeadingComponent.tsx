import { HStack, Icon, Text, useMediaQuery } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { FaEllipsisH, FaHashtag } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import StyleContext from '../../../context/StyleContext';
import { useGetChannelQuery } from '../../../app/features/channel-query';
import { useGetRoleInChannelQuery } from '../../../app/features/member-query';
import { DecodeToken } from '../../../utils/decode-token';
import { ACCESS, IUser } from '../../../models/interface';

const HeadingComponent: React.FC<{
  openModal: () => void;
}> = ({ openModal }) => {
  const { channelId } = useParams();
  const decoded: IUser | null = DecodeToken();
  const { borderLine } = useContext(StyleContext);
  const [isMobile] = useMediaQuery('(max-width: 600px)');

  const { data, isLoading } = useGetChannelQuery(channelId ? channelId : '');
  const { data: role } = useGetRoleInChannelQuery({
    channelId: channelId ? channelId : '',
    userId: decoded ? decoded._id : '',
  });

  return (
    <HStack
      borderBottom="1px"
      borderColor={borderLine}
      p={3}
      justifyContent="space-between"
    >
      <HStack>
        <Icon as={FaHashtag} />
        <Text fontSize={isMobile ? 'xs' : 'xl'} fontWeight="light">
          {isLoading ? 'loading channel...' : data?.name}
        </Text>
      </HStack>

      {(decoded?.priviledge.includes(ACCESS.CREATE_TICKET) ||
        role?.isAdmin === true) && (
        <HStack>
          <Icon as={FaEllipsisH} cursor="pointer" onClick={openModal} />
        </HStack>
      )}
    </HStack>
  );
};

export default HeadingComponent;
