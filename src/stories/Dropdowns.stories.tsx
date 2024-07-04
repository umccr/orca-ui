import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SimpleDropdown from '@/components/common/dropdowns/Dropdown';
// import DropdownWithDividers from '@/components/common/dropdowns/DropdownWithDividers';

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
    groupLabel: 'Group 1',
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
const meta: Meta = {
  title: 'Common/Dropdowns',
  component: SimpleDropdown,
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
export const Dropdown: Story = {
  args: {
    items: exampleItems,
  },
};

export const DropdownWithDividers: Story = {
  args: {
    items: exampleItemsWithDivider,
  },
};
