import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  useGetChannelQuery,
  useManageMembertoChannelMutation,
} from "../../../app/features/channel-query";
import { useListMemberQuery } from "../../../app/features/member-query";
import { schemaAddMemberToChannel } from "../../../models/schemas";
import {
  Box,
  Text,
  HStack,
  Icon,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Tooltip,
  Progress,
  Divider,
  Badge,
  FormControl,
  FormErrorMessage,
  RadioGroup,
  Radio,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import ModalComponent from "../../../components/Modal";
import { Select } from "chakra-react-select";
import { FaSearch, FaTrashAlt } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { DecodeToken } from "../../../utils/decode-token";
import { ACCESS, IUser } from "../../../models/interface";

const ModalMember: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const decoded: IUser | null = DecodeToken();
  const { channelId } = useParams();
  const channelID = channelId ? channelId : "";
  const {
    data: channel,
    isLoading,
    isError,
    refetch,
  } = useGetChannelQuery(channelID);
  const { data: listMembers, isFetching: isMembersFetching } =
    useListMemberQuery({
      page: 1,
      limit: 100,
      search: "",
      status: true,
    });

  const [ManageMembertoChannel] = useManageMembertoChannelMutation();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaAddMemberToChannel),
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      //  TODO: transform the data into API requirement
      const newMember = {
        _id: channelID,
        mode: "ADD",
        data: {
          userId: data.member["value"],
          email: data.member["label"],
          isAdmin: data.isAdmin,
        },
      };
      const result = await ManageMembertoChannel(newMember).unwrap();
      if (result) {
        toast.success(`${data.member["label"]} successfully added as member`);
        refetch();
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  const removeMemberHandler = async (data: any) => {
    try {
      const member = {
        _id: channelID,
        mode: "REMOVE",
        data: {
          userId: data.userId,
          email: data.email,
          isAdmin: data.isAdmin,
        },
      };
      const result = await ManageMembertoChannel(member).unwrap();
      if (result) {
        toast.success(`${data.email} successfully removed as member`);
        refetch();
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  useEffect(() => {
    if (isError)
      return alert("An error has occured!, please reafresh the page ");
  }, [isError]);

  return (
    <ModalComponent
      title={`# Members (${channel?.members.length} participants)`}
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <Box mb={5}>
        {decoded?.priviledge.includes(ACCESS.CREATE_TICKET) && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <FormControl isInvalid={errors?.member ? true : false}>
                <Controller
                  control={control}
                  name="member"
                  render={({ field }) => (
                    <Select
                      {...field}
                      isLoading={isMembersFetching}
                      selectedOptionStyle="color"
                      placeholder="Select a member"
                      options={listMembers?.docs.map(function (member) {
                        return { value: member._id, label: member.email };
                      })}
                      selectedOptionColor="purple"
                      isClearable={true}
                    />
                  )}
                />
                <FormErrorMessage>
                  {errors?.member && "Member is required"}
                </FormErrorMessage>
              </FormControl>

              <HStack justifyContent="space-between">
                <FormControl isInvalid={errors?.isAdmin ? true : false}>
                  <Controller
                    control={control}
                    name="isAdmin"
                    render={({ field }) => (
                      <RadioGroup onChange={(e) => field.onChange(e)}>
                        <Stack spacing={5} direction="row" pl={2}>
                          <Radio colorScheme="yellow" value="0">
                            Standard
                          </Radio>
                          <Radio colorScheme="green" value="1">
                            Admin
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    )}
                  />
                  <FormErrorMessage>
                    {errors?.isAdmin?.message}
                  </FormErrorMessage>
                </FormControl>

                <Button size="sm" type="submit" disabled={!isValid}>
                  Add
                </Button>
              </HStack>
              <Divider />
            </Stack>
          </form>
        )}

        <InputGroup my={5}>
          <InputLeftElement
            zIndex="0"
            pointerEvents="none"
            children={<FaSearch color="gray.300" />}
          />
          <Input
            type="text"
            placeholder="Find member"
            variant="filled"
            onChange={(e) => console.log(e.target.value)}
          />
        </InputGroup>

        {isLoading ? (
          <Box mb={5}>
            <Progress size="xs" isIndeterminate colorScheme="purple" />
            <Text fontWeight="light" color="gray.500">
              please wait...
            </Text>
          </Box>
        ) : (
          <Table size="sm" my={4}>
            <Thead>
              <Tr>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {channel?.members.map((item) => (
                <Tr key={item._id}>
                  <Td>{item.email}</Td>
                  <Td>
                    {item.isAdmin ? (
                      <Badge colorScheme="green">Admin</Badge>
                    ) : (
                      <Badge colorScheme="yellow">Standard</Badge>
                    )}
                  </Td>
                  <Td>
                    <HStack>
                      <Tooltip label="remove member">
                        <Button
                          size="xs"
                          onClick={() => removeMemberHandler(item)}
                        >
                          <Icon as={FaTrashAlt} cursor="pointer" />
                        </Button>
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </ModalComponent>
  );
};

export default ModalMember;
