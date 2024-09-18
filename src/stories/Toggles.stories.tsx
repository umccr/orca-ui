import { Toggle } from '@/components/common/toggles';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Common/Toggle ',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleToggle: Story = {
  args: {
    label: 'Toggle ',
  },
};
