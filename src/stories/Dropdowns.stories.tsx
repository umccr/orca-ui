import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import { Dropdown, IconDropdown } from '@/components/common/dropdowns';
import { FunnelIcon, PlusIcon } from '@heroicons/react/20/solid';
import PopoverDropdown from '@/components/common/dropdowns/PopoverDropdown';

const exampleItems = [
  {
    label: 'Item 1',
    onClick: fn(),
  },
  {
    label: 'Item 2',
    onClick: fn(),
  },
  {
    label: 'Item 3',
    onClick: fn(),
  },
];

const exampleItemsWithDivider = [
  {
    label: 'Item 1',
    onClick: fn(),
  },
  {
    showDivider: true,
  },
  {
    label: 'Item 2',
    onClick: fn(),
  },
  {
    label: 'Item 3',
    onClick: fn(),
  },
  {
    showDivider: true,
  },
  {
    label: 'Item 4',
    onClick: fn(),
  },
];

const exampleItemsWithDisabled = [
  {
    label: 'Item 1',
    onClick: fn(),
  },
  {
    label: 'Item 2',
    onClick: fn(),
  },
  {
    label: 'Item 3',
    onClick: fn(),
    disabled: true,
  },
];
const meta: Meta = {
  title: 'Common/Dropdowns',
  component: Dropdown,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
  // // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const SimpleDropdown: Story = {
  args: {
    floatingLabel: 'Dropdown',
    items: exampleItems,
    value: 'Item 1',
  },
};

export const DropdownWithDividers: Story = {
  args: {
    value: 'Dropdown with Dividers',
    items: exampleItemsWithDivider,
  },
};

export const DropdownWithDisabledItems: Story = {
  args: {
    value: 'Dropdown with Disabled Items',
    items: exampleItemsWithDisabled,
  },
};

export const IconDropdownStory: Story = {
  render: () => {
    return <IconDropdown items={exampleItems} className='bg-blue-700! text-white!' />;
  },
};

export const IconDropdownWithPlusIcon: Story = {
  render: () => {
    return (
      <IconDropdown items={exampleItems} BtnIcon={PlusIcon} className='bg-blue-700! text-white!' />
    );
  },
};
export const CheckboxDropdown: Story = {
  render: () => {
    return (
      <PopoverDropdown
        btnChildren={<FunnelIcon className='mr-2 h-5 w-5' />}
        content={<div className='flex flex-row items-center'>{3}</div>}
      ></PopoverDropdown>
    );
  },
};
