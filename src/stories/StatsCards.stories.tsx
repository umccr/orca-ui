import StatsCards from '@/components/stats/statsCards';
import type { Meta, StoryObj } from '@storybook/react';
import { CursorArrowRaysIcon, EnvelopeOpenIcon, UsersIcon } from '@heroicons/react/24/outline';

const meta: Meta = {
  title: 'Stats/StatsCards',
  component: StatsCards,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleStatsCards: Story = {
  args: {
    header: 'Header',
    items: [
      {
        name: 'Failed in Workflow',
        stat: '7,000',
        icon: EnvelopeOpenIcon,
        changeType: 'increase',
        change: '10',
      },
      {
        name: 'ICA EVENTS DLQ',
        stat: '2,000',
        icon: CursorArrowRaysIcon,
        changeType: 'increase',
        change: '10',
      },
      {
        name: 'ICA EVENTS DLQ',
        stat: '1,000',
        icon: UsersIcon,
        changeType: 'decrease',
        change: '10',
      },
      {
        name: 'ICA EVENTS DLQ',
        stat: '1,000',
        icon: UsersIcon,
      },
    ],
  },
};
