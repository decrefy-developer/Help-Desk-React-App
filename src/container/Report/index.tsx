import { Button, Flex, Icon, Stack, useColorModeValue } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaWindows } from 'react-icons/fa';
import { useReportsQuery } from '../../app/features/ticket-query';
import HeadingComponent from '../../components/Heading';
import { IChannel, IFormReports, STATUS } from '../../models/interface';
import { schemaReports } from '../../models/schemas';
import ExportExcel from './ExportExcel';
import SelectChannel from './SelectChannel';
import SelectClosedDate from './SelectClosedDate';
import SelectOpenDate from './SelectOpenDate';
import SelectStatus from './SelectStatus';
import SelectTeam from './SelectTeam';

const Report = () => {
  const [channels, setChannel] = useState<
    Array<Pick<IChannel, 'name' | '_id'>>
  >([]);
  const color = useColorModeValue('gray.400', 'gray.700');

  const {
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<IFormReports>({
    mode: 'onChange',
    resolver: yupResolver(schemaReports),
  });

  const { data, isFetching } = useReportsQuery({
    openDate: getValues('openDate'),
    closedDate: getValues('closedDate'),
    team: getValues('team') === 'All' ? '' : getValues('team'),
    channelId: getValues('channel') === 'All' ? '' : getValues('channel'),
    statusTicket: getValues('status'),
  });

  async function onSubmit() {
    const transformed = await data?.map((ticket) => {
      let result: any = {
        'Ticket #': ticket?.ticketNumber,
        'Team (Unit)': ticket?.team.name,
        Channel: ticket?.channel.name,
        'Assigned Person': `${ticket?.user.firstName} ${ticket?.user.lastName}`,
        Concern: ticket?.description,
        Solution: ticket?.solution,
        Category: ticket?.category.name,
        'Sub-category': ticket?.subCategory.map((item) => item.name).join(', '),
        Requester: ticket.requestDetails
          ? `${ticket.requestDetails.requester.firstName.toLowerCase()} ${ticket.requestDetails.requester.lastName.toLowerCase()}`
          : ticket?.requesterName.toLowerCase(),
        Department: ticket.requestDetails
          ? ticket.requestDetails.requester.department.name
          : ticket?.department.name,
        'Open Date': new Date(moment(ticket?.createdAt).format('MM/DD/YYYY')),
        'Target Date': new Date(
          moment(ticket?.targetDate).format('MM/DD/YYYY')
        ),
      };

      if (ticket.status === STATUS.CLOSED) {
        result['Closed Date'] = new Date(
          moment(ticket?.closeDate).format('MM/DD/YYYY')
        );

        result['Remark'] = difference(
          moment(ticket?.targetDate).format('MM/DD/YYYY'),
          moment(ticket?.closeDate).format('MM/DD/YYYY')
        );
      }

      return result;
    });

    ExportExcel(transformed);
  }

  function difference(date1: any, date2: any) {
    const firstDate: any = new Date(date1);
    const secondDate: any = new Date(date2);
    const diffTime = Math.ceil(secondDate - firstDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0) return 'delayed';

    return 'ontime';
  }

  return (
    <>
      <Flex w="full" flexDirection="column">
        <HeadingComponent title="Generate Reports" />
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <Stack w="full" direction={['column', 'column', 'row']} p={4}>
          <SelectOpenDate control={control} errors={errors} />
          <SelectClosedDate control={control} errors={errors} />
          <SelectTeam
            control={control}
            errors={errors}
            setChannel={setChannel}
            getValueTeam={getValues}
            watch={watch}
          />
          <SelectChannel
            errors={errors}
            channels={channels}
            control={control}
          />
          <SelectStatus control={control} />
          <Button
            size="sm"
            minW="100px"
            onClick={onSubmit}
            isLoading={isFetching}
          >
            Submit
          </Button>
        </Stack>

        <Flex p={8}>
          <Flex
            w="full"
            bgColor={color}
            h="500px"
            justifyContent="center"
            alignItems="center"
          >
            <Icon as={FaWindows} w={100} h={100} />
          </Flex>
        </Flex>
        {/* </form> */}
      </Flex>
    </>
  );
};

export default Report;
