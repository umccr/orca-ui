import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@/components/common/select';

const people = [
  { label: '1', value: 'Wade Cooper' },
  { label: '2', value: 'Arlene Mccoy' },
  { label: '3', value: 'Devon Webb' },
  { label: '4', value: 'Tom Cook' },
];

const meta: Meta = {
  title: 'Common/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectStory: Story = {
  render: () => {
    return (
      <Select
        value={{ label: '1', value: 'Wade Cooper' }}
        options={people}
        onChange={(value) => console.log(value)}
      />
    );
  },
};
