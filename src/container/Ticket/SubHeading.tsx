import {
  Button,
  Flex,
  Input,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuDivider,
  MenuItemOption,
  MenuItem,
} from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import React, { useContext, useState } from 'react';
import { useListChannelQuery } from '../../app/features/channel-query';
import { useListDepartmentQuery } from '../../app/features/department-query';
import StyleContext from '../../context/StyleContext';

interface Iprops {
  screenPadding: number;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setChannel: React.Dispatch<React.SetStateAction<any>>;
  setDepartment: React.Dispatch<React.SetStateAction<any>>;
  reset: () => void;
}

const SubHeading: React.FC<Iprops> = ({
  screenPadding,
  setText,
  setChannel,
  setDepartment,
  reset,
}) => {
  const { borderLine } = useContext(StyleContext);
  const [selectedFilter, setSelectedFilter] = useState<string | string[]>([]);
  const { data: channels, isFetching } = useListChannelQuery({
    page: 1,
    limit: 1000,
    search: '',
    status: true,
  });

  const { data: departments, isFetching: departmentFetching } =
    useListDepartmentQuery({
      page: 1,
      limit: 1000,
      search: '',
      status: true,
    });

  return (
    <Flex p={screenPadding} borderBottom="1px" borderColor={borderLine}>
      <Stack w="full" direction="column">
        <Stack w="full" direction="row">
          <Menu closeOnSelect={false}>
            <MenuButton as={Button} minWidth="80px">
              Filters
            </MenuButton>
            <MenuList>
              <MenuOptionGroup
                title="Select Filter"
                type="checkbox"
                onChange={(value) => setSelectedFilter(value)}
              >
                <MenuItemOption value="channel">Channel</MenuItemOption>
                <MenuItemOption value="department">Department</MenuItemOption>
                <MenuItemOption value="dateCreated">
                  Date Created
                </MenuItemOption>
              </MenuOptionGroup>
              <MenuDivider />
              <MenuItem color="danger" onClick={reset}>
                Clear Filter
              </MenuItem>
            </MenuList>
          </Menu>
          {selectedFilter.includes('channel') && (
            <Select
              id="channelId"
              isLoading={isFetching}
              onChange={(e) => setChannel(e?.value)}
              selectedOptionStyle="color"
              placeholder="Select Channel"
              options={channels?.docs.map(function (item) {
                return { value: item._id, label: item.name };
              })}
              selectedOptionColor="purple"
              className="react-select"
            />
          )}

          {selectedFilter.includes('department') && (
            <Select
              id="departmentId"
              isLoading={departmentFetching}
              onChange={(e) => setDepartment(e?.value)}
              selectedOptionStyle="color"
              placeholder="Select Department"
              options={departments?.docs.map(function (item) {
                return { value: item._id, label: item.name };
              })}
              selectedOptionColor="purple"
              className="react-select"
            />
          )}
        </Stack>

        <Stack w="full" direction="row">
          <Input
            type="text"
            placeholder="Search Ticket Number"
            variant="filled"
            onChange={(e) => setText(e.target.value)}
          />
        </Stack>
      </Stack>
    </Flex>
  );
};

export default SubHeading;
