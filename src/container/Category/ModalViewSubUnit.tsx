import {
  Badge,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Icon,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from '@chakra-ui/react';
import Pagination from '@choc-ui/paginator';
import React, { useState } from 'react';
import { FaTrashAlt, FaUndo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  useAddSubCategoryMutation,
  useChangeSubUnitStatusMutation,
  useListSubCategoryQuery,
} from '../../app/features/category-query';
import ModalComponent from '../../components/Modal';
import useTableControl from '../../hooks/useTableControl';

interface Props {
  rowId: string;
  isOpen: boolean;
  onClosed: () => void;
}

const ModalViewUnitSubUnit: React.FC<Props> = ({ isOpen, onClosed, rowId }) => {
  const [subUnit, setSubUnit] = useState('');
  const [error, setError] = useState('');
  const [isArchieve, setIsArchieve] = useState<boolean>(false);
  const { page, pageLimit, search, onChangePage, onChangeLimit } =
    useTableControl();

  const { data, isLoading } = useListSubCategoryQuery({
    page,
    limit: pageLimit,
    search,
    status: !isArchieve,
    categoryId: rowId,
  });

  const [addSubCategory] = useAddSubCategoryMutation();
  const [changeSubUnitStatus] = useChangeSubUnitStatusMutation();

  const onSubmitHandler = async () => {
    try {
      if (!subUnit) {
        setError('Name is required');
        return;
      }
      const input = {
        categoryId: rowId,
        name: subUnit,
      };
      const result = await addSubCategory(input).unwrap();
      if (result) {
        toast.success(`${subUnit} has been succesfully saved`);
        setSubUnit('');
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  const changeStatusHandler = async (_id: string, isActive: boolean) => {
    try {
      const result = await changeSubUnitStatus({
        _id,
        isActive: !isActive,
      }).unwrap();
      if (result) {
        let message = 'successfully restored';
        if (!result.isActive) {
          message = 'successfully moved to archieve';
        }
        toast.success(`${result.name} ${message}`);
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  };

  return (
    <ModalComponent
      title="Sub-category List"
      isOpen={isOpen}
      onClose={onClosed}
      size="lg"
      isCentered={false}
    >
      <Stack direction="row">
        <FormControl isInvalid={error ? true : false}>
          <Input
            placeholder="Name"
            value={subUnit}
            onChange={(e) => setSubUnit(e.target.value)}
          />
          <FormErrorMessage>{error}</FormErrorMessage>
        </FormControl>

        <Button type="button" onClick={onSubmitHandler}>
          Submit
        </Button>
      </Stack>

      <Divider my={5} />

      <Flex py={8} w="full" alignItems="center" justifyContent="space-between">
        {isLoading ? (
          <Text color="gray.500">Pagination is loading..</Text>
        ) : (
          <HStack>
            <Pagination
              currentPage={page}
              total={data?.totalDocs}
              paginationProps={{ display: 'flex' }}
              baseStyles={{ border: '1px' }}
              activeStyles={{ bg: 'primary' }}
              onChange={(page) => onChangePage(page)}
              pageSize={pageLimit}
              showSizeChanger
              onShowSizeChange={(__, size) => {
                onChangeLimit(size);
                onChangePage(1);
              }}
            />
            <Text fontSize="sm" color="gray.500">
              Items: {data?.totalDocs}
            </Text>
          </HStack>
        )}

        <HStack alignContent="center">
          {!isLoading && (
            <Checkbox onChange={(e) => setIsArchieve(e.target.checked)}>
              <Text fontSize="sm" color="gray.500">
                show archived
              </Text>
            </Checkbox>
          )}
        </HStack>
      </Flex>

      {isLoading ? (
        <HStack mb={5} justifyContent="center">
          <CircularProgress isIndeterminate color="primary" size="30px" />
          <Text color="gray.500">Table is loading..</Text>
        </HStack>
      ) : (
        <Table borderColor="white" size="sm">
          <Thead>
            <Tr>
              <Th>Sub-category Name</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.docs.map((unit) => (
              <Tr key={unit._id}>
                <Td>{unit.name}</Td>
                <Td>
                  <Text>
                    {unit.isActive ? (
                      <Badge colorScheme="green">Active</Badge>
                    ) : (
                      <Badge colorScheme="red">Deactivated</Badge>
                    )}
                  </Text>
                </Td>
                <Td>
                  {unit.isActive ? (
                    <HStack>
                      <Tooltip label="move to archive" closeOnClick={false}>
                        <Button
                          size="xs"
                          onClick={() =>
                            changeStatusHandler(unit._id, unit.isActive)
                          }
                        >
                          <Icon as={FaTrashAlt} cursor="pointer" />
                        </Button>
                      </Tooltip>
                    </HStack>
                  ) : (
                    <HStack>
                      <Tooltip label="restore">
                        <Button
                          size="xs"
                          onClick={() =>
                            changeStatusHandler(unit._id, unit.isActive)
                          }
                        >
                          <Icon as={FaUndo} cursor="pointer" />
                        </Button>
                      </Tooltip>
                    </HStack>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </ModalComponent>
  );
};

export default ModalViewUnitSubUnit;
