import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Stack,
  Textarea,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Select } from 'chakra-react-select';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { object, string, array } from 'yup';
import {
  useListCategoryConcernQuery,
  useListSubCategoryQuery,
} from '../../../app/features/category-query';
import { useUpdateStatusMutation } from '../../../app/features/request-query';
import { useDoneTicketMutation } from '../../../app/features/ticket-query';
import ModalComponent from '../../../components/Modal';
import { ITicket } from '../../../models/interface';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTicket: ITicket | undefined;
}

const schema = object({
  solution: string().required('solution is required!'),
  categoryId: string().required('Category is required'),
  SubCategoryId: array().of(string()),
});

const ModalDoneTicket: React.FC<IProps> = ({
  isOpen,
  onClose,
  selectedTicket,
}) => {
  const initialRef: any = React.useRef();
  const [categoryId, setCategoryId] = useState('');
  const [defaultValue, setDefaultValue] = useState<{
    value: string | undefined;
    label: string | undefined;
  }>();
  const [defaultValueSub, setDefaultValueSub] = useState<any>();
  const [doneTicket, { isLoading }] = useDoneTicketMutation();
  const [updateStatus] = useUpdateStatusMutation();
  const { data: categories, isLoading: loadingCategories } =
    useListCategoryConcernQuery({
      page: 1,
      limit: 1000,
      search: '',
      status: true,
    });

  const { data: subCategories, isLoading: loadingSub } =
    useListSubCategoryQuery({
      page: 1,
      limit: 1000,
      search: '',
      status: true,
      categoryId,
    });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ mode: 'onChange', resolver: yupResolver(schema) });

  async function onSubmit(data: any) {
    try {
      if (selectedTicket?._id) {
        data._id = selectedTicket?._id;
        data.mode = 'DONE TICKET';

        const result = await doneTicket(data).unwrap();
        if (result) {
          toast.success(`# ${result.ticketNumber} has been completed`);
          //   setSelectedTicket(undefined);
          onClose();
          await updateStatus({ _id: result.requestId, status: true });
        }
      }
    } catch (err: any) {
      toast.error(err.data.message);
    }
  }

  useEffect(() => {
    if (getValues('categoryId')) {
      let id = getValues('categoryId');
      setCategoryId(id);
    }
  }, [getValues('categoryId')]);

  useEffect(() => {
    setDefaultValue({
      value: selectedTicket?.category._id,
      label: selectedTicket?.category.name,
    });
    setDefaultValueSub(
      selectedTicket?.subCategory.map(function (item) {
        return { value: item._id, label: item.name };
      })
    );
  }, [selectedTicket]);

  useEffect(() => {
    setValue('categoryId', selectedTicket?.category._id);
    setValue(
      'SubCategoryId',
      selectedTicket?.subCategory.map(function (item) {
        return item._id;
      })
    );
  }, [selectedTicket?.category._id, selectedTicket?.subCategory, setValue]);

  console.log('watch', watch('SubCategoryId'));

  return (
    <ModalComponent
      title="accomplishing..."
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      isCentered={true}
      initialFocusRef={initialRef}
      closeOnOverlayClick={false}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack mb={4}>
          <FormControl isInvalid={errors?.solution ? true : false}>
            <FormLabel>
              Solution
              <span role="img" aria-label="sheep">
                😍
              </span>
            </FormLabel>

            <Controller
              control={control}
              name="solution"
              render={({ field }) => (
                <Textarea
                  height="150px"
                  placeholder="ex: Replaced the Ink Cartridge"
                  {...field}
                />
              )}
            />
            <FormErrorMessage justifyContent="flex-end">
              {errors?.solution?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors?.categoryId ? true : false}>
            <FormLabel htmlFor="categoryId" fontSize="sm" color="gray.400">
              Major Category Concern
            </FormLabel>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  defaultValue={defaultValue}
                  id="categoryId"
                  onChange={(e) => field.onChange(e?.value)}
                  selectedOptionStyle="color"
                  placeholder="Select Concern"
                  options={categories?.docs.map(function (category) {
                    return { value: category._id, label: category.name };
                  })}
                  selectedOptionColor="purple"
                  isClearable={true}
                  isLoading={loadingCategories}
                />
              )}
            />
            <FormErrorMessage justifyContent="flex-end">
              {errors?.categoryId?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors?.SubCategoryId ? true : false}>
            <FormLabel htmlFor="SubCategoryId" fontSize="sm" color="gray.400">
              Sub Category
            </FormLabel>
            <Controller
              control={control}
              name="SubCategoryId"
              render={({ field }) => (
                <Select
                  defaultValue={defaultValueSub}
                  id="SubCategoryId"
                  // onChange={(e) => field.onChange(e?.value)}
                  onChange={(e) =>
                    field.onChange(
                      e.map((i) => {
                        return i.value;
                      })
                    )
                  }
                  selectedOptionStyle="color"
                  placeholder="Select Sub-category"
                  options={subCategories?.docs.map(function (sub) {
                    return { value: sub._id, label: sub.name };
                  })}
                  selectedOptionColor="purple"
                  isClearable={true}
                  isLoading={loadingSub}
                  isMulti={true}
                />
              )}
            />
            <FormErrorMessage justifyContent="flex-end">
              {errors?.SubCategoryId?.message}
            </FormErrorMessage>
          </FormControl>
        </Stack>

        <HStack my={5}>
          <Button
            type="submit"
            size="sm"
            bgColor="success"
            isLoading={isLoading}
          >
            Submit
          </Button>
          <Button size="sm" bgColor="danger" onClick={onClose}>
            Cancel
          </Button>
        </HStack>
      </form>
    </ModalComponent>
  );
};

export default ModalDoneTicket;
