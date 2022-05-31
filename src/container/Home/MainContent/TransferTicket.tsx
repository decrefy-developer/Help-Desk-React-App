import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Stack,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import moment from 'moment';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetChannelQuery } from '../../../app/features/channel-query';
import { useGetTeamQuery } from '../../../app/features/team-query';
import {
  useListTransferTicketQuery,
  useUpdateTransferTicketMutation,
} from '../../../app/features/transfer-query';
import HeadingComponent from '../../../components/Heading';

const TransferTicket = () => {
  const { teamId } = useParams();
  const [isMobile] = useMediaQuery('(max-width: 767px)');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [channel, setChannel] = useState<string>();
  const [user, setUser] = useState<string>();
  const [channelError, setChannelError] = useState<string>();
  const [userError, setUserError] = useState<string>();
  const { data: transferQuery } = useListTransferTicketQuery({
    team: teamId ? teamId : 'placeholder',
  });

  const { data: teamQuery, isFetching: teamLoading } = useGetTeamQuery(
    teamId ? teamId : ''
  );

  const { data: channelQuery, isFetching: channelLoading } = useGetChannelQuery(
    channel ? channel : ''
  );

  const [updateTransferTicket] = useUpdateTransferTicketMutation();

  function assignTechHandler(_id: string) {
    setSelectedItem(_id);
  }

  async function submitHandler() {
    if (!channel) return setChannelError('Channel is required');
    setChannelError('');
    if (!user) return setUserError('user is required');
    setUserError('');

    const dataForm = {
      _id: selectedItem,
      mode: 'APPROVE',
      channelId: channel ? channel : '',
      userId: user ? user : '',
    };

    try {
      const result = await updateTransferTicket(dataForm).unwrap();

      if (result) {
        toast.success(
          `ticket #${result.ticketNumber} successfully transferred`
        );
        setSelectedItem('');
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  }

  return (
    <>
      <Flex w="full" flexDirection="column">
        <HeadingComponent title="Request to transfer" />

        <Flex p={8} flexDirection={isMobile ? 'column' : 'row'}>
          <Box flexDirection="column" w={isMobile ? 'full' : '50%'}>
            {transferQuery?.map((item, i) => (
              <Stack
                key={item._id}
                border="solid #4a5568 1px"
                p={3}
                mt={i > 0 ? 6 : 0}
                backgroundColor={item._id === selectedItem ? '#011627' : 'none'}
              >
                <Stack gap={2}>
                  <HStack>
                    <Text color="gray.500">Ticket #: </Text>
                    <Text>{item.ticketNumber}</Text>
                  </HStack>
                  <HStack>
                    <Text color="gray.500">Date Requested: </Text>
                    <Text>
                      {moment(item.createdAt).format('MM-DD-YYYY, h:mm:ss a')}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text color="gray.500">From:</Text>
                    <Text>{item.from.team.name}</Text>
                  </HStack>
                  <HStack>
                    <Text color="gray.500">Concern:</Text>
                    <Text>{item.description}</Text>
                  </HStack>
                  <HStack>
                    <Text color="gray.500">Remarks:</Text>
                    <Text>{item.remarks}</Text>
                  </HStack>
                  <Button
                    size="xs"
                    background="primary"
                    onClick={() => assignTechHandler(item._id)}
                  >
                    Assign
                  </Button>
                </Stack>
              </Stack>
            ))}
          </Box>

          <Flex w={isMobile ? 'full' : '50%'}>
            {selectedItem && (
              <Box
                border="solid #4a5568 1px"
                p={3}
                w="full"
                ml={isMobile ? 0 : 6}
                mt={isMobile ? 6 : 0}
              >
                <Stack gap={3}>
                  <FormControl isInvalid={channelError ? true : false}>
                    <FormLabel
                      htmlFor="channelId"
                      fontSize="sm"
                      color="gray.400"
                    >
                      Channel
                    </FormLabel>

                    <Select
                      id="channelId"
                      onChange={(e) => setChannel(e?.value)}
                      escapeClearsValue={true}
                      selectedOptionStyle="color"
                      placeholder="select channel"
                      options={teamQuery?.channels.map(function (channel) {
                        return { value: channel._id, label: channel.name };
                      })}
                      selectedOptionColor="purple"
                      isClearable={true}
                      isLoading={teamLoading}
                    />

                    <FormErrorMessage justifyContent="flex-end">
                      {channelError}
                    </FormErrorMessage>
                  </FormControl>
                  tr
                  <FormControl isInvalid={userError ? true : false}>
                    <FormLabel htmlFor="user" fontSize="sm" color="gray.400">
                      User
                    </FormLabel>

                    <Select
                      id="user"
                      escapeClearsValue={true}
                      onChange={(e) => setUser(e?.value)}
                      selectedOptionStyle="color"
                      placeholder={'select User'}
                      options={channelQuery?.members.map(function (user) {
                        return { value: user.userId, label: user.email };
                      })}
                      selectedOptionColor="purple"
                      isClearable={true}
                      isLoading={channelLoading}
                    />

                    <FormErrorMessage justifyContent="flex-end">
                      {userError}
                    </FormErrorMessage>
                  </FormControl>
                  <Button backgroundColor="success" onClick={submitHandler}>
                    Submit
                  </Button>
                </Stack>
              </Box>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default TransferTicket;
