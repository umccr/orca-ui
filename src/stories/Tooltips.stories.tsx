import { Tooltip } from '@/components/common/tooltips';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, StatusBadge } from '@/components/common/badges';

import { Button } from '@/components/common/buttons';

const meta: Meta = {
  title: 'Common/Tooltips',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Top: Story = {
  render: () => (
    <Tooltip text='Tooltip text' position='top'>
      <Button type='primary'>Hover me</Button>
    </Tooltip>
  ),
};

export const TopWithLargeTooltip: Story = {
  render: () => (
    <Tooltip text='Tooltip text' position='top' size='large'>
      <Button type='primary'>Hover me</Button>
    </Tooltip>
  ),
};

export const TopWithSmallTooltip: Story = {
  render: () => (
    <Tooltip text='Tooltip text' position='top' size='small'>
      <Button type='primary'>Hover me</Button>
    </Tooltip>
  ),
};

export const TopWithSmallWhiteTooltip: Story = {
  render: () => (
    <Tooltip text='Tooltip text' position='top' size='small' background='light'>
      <Button type='primary'>Hover me</Button>
    </Tooltip>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Tooltip text='Tooltip text' position='bottom'>
      <Button type='primary'>Hover me</Button>
    </Tooltip>
  ),
};

export const Left: Story = {
  render: () => (
    <Tooltip text='Tooltip text' position='left'>
      <Button type='primary'>Hover me</Button>
    </Tooltip>
  ),
};

export const Right: Story = {
  render: () => (
    <Tooltip text='Tooltip text' position='right' size='small'>
      <Button type='primary'>Hover me</Button>
    </Tooltip>
  ),
};

export const WithBadge: Story = {
  render: () => (
    <Tooltip text='Tooltip text' position='top'>
      <Badge type='primary'>Hover me</Badge>
    </Tooltip>
  ),
};

export const WithStatusBadge: Story = {
  render: () => (
    <Tooltip text='Tooltip text' position='top'>
      <StatusBadge status='active'></StatusBadge>
    </Tooltip>
  ),
};
