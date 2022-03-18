import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  useGetMemberQuery,
  useUpdateMemberAcessMutation,
} from "../../app/features/member-query";
import ModalComponent from "../../components/Modal";
import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  ModalFooter,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ACCESS } from "../../models/interface";

const ModalChangeAccess: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}> = ({ isOpen, onClose, userId }) => {
  const [checkedAccess, setCheckedAccess] = useState<Array<string>>([]);
  const { data, isFetching } = useGetMemberQuery(userId);
  const [isError, setIsError] = useState<boolean>(false);
  const [updateMemberAcess] = useUpdateMemberAcessMutation();

  const setAccess = (isChecked: boolean, item: string) => {
    if (isChecked) {
      setCheckedAccess([...checkedAccess, item]);
    } else {
      setCheckedAccess(checkedAccess.filter((access) => access !== item));
    }
  };

  const onSubmit = async () => {
    try {
      const result = await updateMemberAcess({
        _id: userId,
        priviledge: checkedAccess,
      }).unwrap();

      if (result) {
        onClose();
        toast.success(`${result.email} access has changed`);
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }

    setIsError(false);
  };

  useEffect(() => {
    if (data) setCheckedAccess(data?.priviledge);
  }, [data]);

  return (
    <ModalComponent
      title="Account Access"
      isOpen={isOpen}
      onClose={onClose}
      isCentered={true}
    >
      {isFetching ? (
        <Stack w="full" py={10} px="5">
          <Skeleton height="20px" />
          <Skeleton height="20px" />
          <Skeleton height="20px" />
        </Stack>
      ) : (
        <Box pb={5}>
          <Stack spacing={2}>
            <FormLabel>Access</FormLabel>
            <Checkbox
              isChecked={
                checkedAccess.includes(ACCESS.CREATE_TICKET) ? true : false
              }
              onChange={(e) =>
                setAccess(e.target.checked, ACCESS.CREATE_TICKET)
              }
            >
              Create Ticket
            </Checkbox>
            <Checkbox
              isChecked={
                checkedAccess.includes(ACCESS.REQUESTER) ? true : false
              }
              onChange={(e) => setAccess(e.target.checked, ACCESS.REQUESTER)}
            >
              Requester
            </Checkbox>
            <Checkbox
              isChecked={checkedAccess.includes(ACCESS.MEMBERS) ? true : false}
              onChange={(e) => setAccess(e.target.checked, ACCESS.MEMBERS)}
            >
              Manage Members
            </Checkbox>
            <Checkbox
              isChecked={checkedAccess.includes(ACCESS.TEAMS) ? true : false}
              onChange={(e) => setAccess(e.target.checked, ACCESS.TEAMS)}
            >
              Manage Teams
            </Checkbox>
            <Checkbox
              isChecked={checkedAccess.includes(ACCESS.CHANNELS) ? true : false}
              onChange={(e) => setAccess(e.target.checked, ACCESS.CHANNELS)}
            >
              Manage Channels
            </Checkbox>
            <Checkbox
              isChecked={checkedAccess.includes(ACCESS.CATEGORY) ? true : false}
              onChange={(e) => setAccess(e.target.checked, ACCESS.CATEGORY)}
            >
              Manage Category Concern
            </Checkbox>
            <Checkbox
              isChecked={checkedAccess.includes(ACCESS.CUSTOMER) ? true : false}
              onChange={(e) => setAccess(e.target.checked, ACCESS.CUSTOMER)}
            >
              Manage Customers
            </Checkbox>
          </Stack>
          <Text textAlign="left" fontSize="xs" mt={3} color="danger">
            {isError && "Please select atleast one"}
          </Text>
        </Box>
      )}
      <ModalFooter p="0px" mb="8px">
        <Button variant="solid" bg="primary" size="sm" onClick={onSubmit}>
          Update Changes
        </Button>
      </ModalFooter>
    </ModalComponent>
  );
};

export default ModalChangeAccess;
