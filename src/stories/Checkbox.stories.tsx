import { Checkbox } from '@/components/common/checkbox';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Common/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleCheckbox: Story = {
  args: {
    label: 'Checkbox',
  },
};
