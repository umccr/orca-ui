import Badge from '@/components/common/badges';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Common/Badges',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryBadge: Story = {
  args: {
    children: 'PrimaryBadge',
  },
};

export const SecondaryBadge: Story = {
  args: {
    children: 'Secondary Badge',
    type: 'secondary',
  },
};

export const SuccessBadge: Story = {
  args: {
    children: 'Success Badge',
    type: 'success',
  },
};

export const FailBadge: Story = {
  args: {
    children: 'Fail Badge',
    type: 'fail',
  },
};

export const WarningBadge: Story = {
  args: {
    children: 'Warning Badge',
    type: 'warning',
  },
};

export const AbortBadge: Story = {
  args: {
    children: 'Abort Badge',
    type: 'abort',
  },
};
