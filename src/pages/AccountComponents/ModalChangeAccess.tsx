import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import {
  useGetMemberQuery,
  useUpdateMemberAcessMutation,
} from "../../features/member-query";
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
    // if (checkedAccess.length <= 0) return setIsError(true);

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
              isChecked={checkedAccess.includes("CREATE TICKET") ? true : false}
              onChange={(e) => setAccess(e.target.checked, "CREATE TICKET")}
            >
              Create Ticket
            </Checkbox>
            <Checkbox
              isChecked={checkedAccess.includes("MEMBERS") ? true : false}
              onChange={(e) => setAccess(e.target.checked, "MEMBERS")}
            >
              Manage Members
            </Checkbox>
            <Checkbox
              isChecked={checkedAccess.includes("TEAMS") ? true : false}
              onChange={(e) => setAccess(e.target.checked, "TEAMS")}
            >
              Manage Teams
            </Checkbox>
            <Checkbox
              isChecked={checkedAccess.includes("CHANNELS") ? true : false}
              onChange={(e) => setAccess(e.target.checked, "CHANNELS")}
            >
              Manage Channels
            </Checkbox>
            <Checkbox
              isChecked={checkedAccess.includes("CATEGORY") ? true : false}
              onChange={(e) => setAccess(e.target.checked, "CATEGORY")}
            >
              Manage Category Concern
            </Checkbox>
            <Checkbox
              isChecked={checkedAccess.includes("CUSTOMERS") ? true : false}
              onChange={(e) => setAccess(e.target.checked, "CUSTOMERS")}
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
