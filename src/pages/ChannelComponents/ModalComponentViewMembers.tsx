import {
  Badge,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ModalComponent from "../../components/Modal";
import { IChannel, IFormInputChannelMember } from "../../models/interface";
import { Select } from "chakra-react-select";
import { useListMemberQuery } from "../../features/member-query";
import { Icon } from "@chakra-ui/icons";
import { FaCross, FaPen, FaTrashAlt } from "react-icons/fa";
import { useAddMembertoChannelMutation } from "../../features/channel-query";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { schemaAddMemberToChannel } from "../../models/schemas";
import { toast } from "react-toastify";

interface IModal {
  data: Array<IChannel>;
  selectedRow: string;
  isOpen: boolean;
  onClosed: () => void;
}

const ModalComponentViewMembers: React.FC<IModal> = ({
  data,
  selectedRow,
  isOpen,
  onClosed,
}) => {
  const [members, setMembers] = useState<IChannel>();
  const {
    data: listMembers,
    isError,
    isFetching,
  } = useListMemberQuery({
    page: 1,
    limit: 100,
    search: "",
    status: true,
  });
  const [addMembertoChannel] = useAddMembertoChannelMutation();

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
        _id: selectedRow,
        userId: data.member["value"],
        email: data.member["label"],
        isAdmin: data.isAdmin,
      };

      const result = await addMembertoChannel(newMember).unwrap();
      if (result) {
        console.log("result", result);
      }

      console.log(newMember);
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  useEffect(() => {
    let selectedMember = data.filter(({ _id }) => _id === selectedRow);

    setMembers(selectedMember[0]);
  }, [data, selectedRow]);

  useEffect(() => {
    if (isError)
      return alert("An error has occurred!, please refresh the page");
  }, [isError]);

  return (
    <ModalComponent
      title="Members"
      isOpen={isOpen}
      onClose={onClosed}
      size="md"
      isCentered={false}
      closeOnOverlayClick={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          <FormControl isInvalid={errors?.member ? true : false}>
            <Controller
              control={control}
              name="member"
              render={({ field }) => (
                <Select
                  // onChange={(e) => field.onChange(e?.value)}
                  {...field}
                  isLoading={isFetching}
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
              <FormErrorMessage>{errors?.isAdmin?.message}</FormErrorMessage>
            </FormControl>

            <Button size="sm" type="submit" disabled={!isValid}>
              Add
            </Button>
          </HStack>
          <Divider />
        </Stack>
      </form>
      <Table size="sm" my={4}>
        <Thead>
          <Tr>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {members?.members.map((item) => (
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
                    <Button size="xs">
                      <Icon as={FaTrashAlt} cursor="pointer" />
                    </Button>
                  </Tooltip>

                  <Tooltip label="edit role">
                    <Button size="xs">
                      <Icon as={FaPen} cursor="pointer" />
                    </Button>
                  </Tooltip>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </ModalComponent>
  );
};

export default ModalComponentViewMembers;
