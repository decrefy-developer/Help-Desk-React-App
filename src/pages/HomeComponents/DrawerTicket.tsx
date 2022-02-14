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
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../app/store";
import { useAddTicketMutation } from "../../features/ticket-query";
import { IChannel, IFormInputTicket } from "../../models/interface";
import { schemaTicket } from "../../models/schemas";
import SelectCategory from "./SelectCategory";
import SelectChannel from "./SelectChannel";
import SelectCoworker from "./SelectCoworker";
import SelectCustomer from "./SelectCustomer";
import SelectStartDate from "./SelectStartDate";
import SelectTargetDate from "./SelectTargetDate";
import SelectTeam from "./SelectTeam";
import SelectUser from "./SelectUser";
import TextAreaConcern from "./TextAreaConcern";

const DrawerTicket = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [channels, setChannel] = useState<
    Array<Pick<IChannel, "name" | "_id" | "isActive">>
  >([]);

  const { _id } = useSelector((state: RootState) => state.userSlice);
  const [addTicket] = useAddTicketMutation();

  const {
    handleSubmit,
    watch,
    control,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schemaTicket),
  });

  const watchAllFields = watch();

  const onSubmit: SubmitHandler<IFormInputTicket> = async (data) => {
    try {
      data.state = "PENDING";
      data.status = "OPEN";
      data.createdBy = _id;

      console.log(data);

      const newTicket = await addTicket(data).unwrap();

      if (newTicket) {
        console.log("submitted", newTicket);
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      closeOnOverlayClick={false}
      size="xl"
    >
      <DrawerOverlay />
      <form onSubmit={handleSubmit(onSubmit)}>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">New Ticket</DrawerHeader>

          <DrawerBody>
            <Stack direction={{ base: "column", md: "row" }} mt={5}>
              <Stack spacing="24px" w="full" p={4} borderWidth="1px">
                <Text color="success">Concern Details</Text>

                <SelectCustomer control={control} errors={errors} />

                <SelectCategory control={control} errors={errors} />
                <TextAreaConcern control={control} errors={errors} />
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

                <SelectUser control={control} watch={watch} />

                <SelectCoworker control={control} watch={watch} />

                <SelectStartDate control={control} errors={errors} />
                <SelectTargetDate control={control} errors={errors} />
              </Stack>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button bgColor="primary" type="submit" disabled={!isValid}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </form>
    </Drawer>
  );
};

export default DrawerTicket;
