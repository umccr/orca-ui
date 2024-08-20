import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from '@/components/common/statusBadge';

const meta: Meta = {
  title: 'Common/StatusBadge',
  component: StatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const StatusBadgeStory: Story = {
  render: () => {
    return <StatusBadge status='succeeded' />;
  },
};

export const StatusBadgeStoryFailed: Story = {
  render: () => {
    return <StatusBadge status='failed' />;
  },
};

export const StatusBadgeStoryQueued: Story = {
  render: () => {
    return <StatusBadge status='queued' />;
  },
};

export const StatusBadgeStoryInProgress: Story = {
  render: () => {
    return <StatusBadge status='InProgress' />;
  },
};

export const StatusBadgeStoryRequested: Story = {
  render: () => {
    return <StatusBadge status='Requested' />;
  },
};

export const StatusBadgeStoryInitializing: Story = {
  render: () => {
    return <StatusBadge status='Initializing' />;
  },
};

export const StatusBadgeStoryPreparingInputs: Story = {
  render: () => {
    return <StatusBadge status='PreparingInputs' />;
  },
};

// enum WorkflowStatus {
//     Requested = 'Requested',
//     Queued = 'Queued',
//     Initializing = 'Initializing',
//     PreparingInputs = 'Preparing Inputs',
//     InProgress = 'In Progress',
//     GeneratingOutputs = 'Generating outputs',
//     Aborting = 'Aborting',
//     Aborted = 'Aborted',
//     Failed = 'Failed',
//     Succeeded = 'Succeeded',
//   }
