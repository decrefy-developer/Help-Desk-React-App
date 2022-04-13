import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Stack,
  Text,
  HStack,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useUpdateStatusMutation } from "../../app/features/request-query";
import { useAddTicketMutation } from "../../app/features/ticket-query";
import {
  IChannel,
  IRequest,
  IUser,
  STATE,
  STATUS,
} from "../../models/interface";
import { schemaTicket } from "../../models/schemas";
import Socket from "../../services/Socket";
import { DecodeToken } from "../../utils/decode-token";
import InputRequester from "./InputRequester";
import SelectCategory from "./SelectCategory";
import SelectChannel from "./SelectChannel";
import SelectCoworker from "./SelectCoworker";
import SelectCustomer from "./SelectCustomer";
import SelectDepartment from "./SelectDepartment";
import SelectStartDate from "./SelectStartDate";
import SelectSubUnit from "./SelectSubUnit";
import SelectTargetDate from "./SelectTargetDate";
import SelectTeam from "./SelectTeam";
import SelectUser from "./SelectUser";
import TextAreaConcern from "./TextAreaConcern";

interface Iprops {
  isOpen: boolean;
  onClose: () => void;
  formData: IRequest | null;
}

const DrawerTicket: React.FC<Iprops> = ({ isOpen, onClose, formData }) => {
  const [channels, setChannel] = useState<
    Array<Pick<IChannel, "name" | "_id" | "isActive">>
  >([]);

  const decoded: IUser | null = DecodeToken();
  const [addTicket, { isLoading }] = useAddTicketMutation();
  const [updateStatus] = useUpdateStatusMutation();

  const {
    handleSubmit,
    watch,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaTicket),
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      data.requestId = formData?._id;
      data.state = STATE.PENDING;
      data.status = STATUS.OPEN;
      data.createdBy = decoded?._id;
      console.log(data);
      const newTicket = await addTicket(data).unwrap();

      if (newTicket) {
        console.log("newTicket", newTicket);
        onClose();
        reset();
        toast.success(
          `${newTicket.ticketNumber} has been successfully created`
        );
        await Socket.emit("send-ticket", newTicket);
        await updateStatus({ _id: newTicket.requestId, status: false });
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  useEffect(() => {
    if (formData) {
      const Requester = `${formData?.user.firstName.toUpperCase()} ${formData?.user.lastName.toUpperCase()}`;
      setValue("description", formData.concern);
      setValue("requesterName", Requester);
      setValue("departmentId", formData?.user?.department._id);
    }
  }, [formData, setValue]);

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      closeOnOverlayClick={false}
      size="xl"
      closeOnEsc={true}
    >
      <DrawerOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">New Ticket</DrawerHeader>

          <DrawerBody>
            <Stack direction={{ base: "column", md: "row" }} mt={5}>
              <Stack spacing="24px" w="full" p={4} borderWidth="1px">
                <Text color="success">Requester Details</Text>

                {formData ? (
                  <Stack spacing="16px">
                    <HStack>
                      <Text color="gray.400">Name: </Text>
                      <Text color="primary">{`${formData?.user.firstName.toUpperCase()} ${formData?.user.lastName.toUpperCase()}`}</Text>
                    </HStack>
                    <HStack>
                      <Text color="gray.400">Department: </Text>
                      <Text color="primary">
                        {`${formData?.user.department.name.toUpperCase()}`}{" "}
                      </Text>
                    </HStack>
                    <HStack>
                      <Text color="gray.400">Unit: </Text>
                      <Text color="primary">
                        {`${
                          formData?.user.unit ? formData.user.unit.name : ""
                        }`}
                      </Text>
                    </HStack>
                  </Stack>
                ) : (
                  <Stack spacing="24px" w="full">
                    <SelectDepartment control={control} errors={errors} />
                    <InputRequester control={control} errors={errors} />
                  </Stack>
                )}

                <TextAreaConcern control={control} errors={errors} />
                <SelectCategory control={control} errors={errors} />
                <SelectSubUnit
                  control={control}
                  errors={errors}
                  getValues={getValues}
                />
              </Stack>

              <Stack spacing="24px" w="full" p={4} borderWidth="1px">
                <Text color="success">Set Ticket Details</Text>
                <SelectTeam
                  control={control}
                  errors={errors}
                  getValues={getValues}
                  setChannel={setChannel}
                />
                <SelectChannel
                  channels={channels}
                  control={control}
                  errors={errors}
                />

                <SelectUser control={control} watch={watch} errors={errors} />

                <SelectCoworker
                  control={control}
                  watch={watch}
                  errors={errors}
                />

                <SelectStartDate control={control} errors={errors} />
                <SelectTargetDate control={control} errors={errors} />
              </Stack>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              bgColor="primary"
              type="submit"
              disabled={!isValid}
              isLoading={isLoading}
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default DrawerTicket;
