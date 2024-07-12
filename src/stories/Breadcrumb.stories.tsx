import type { Meta, StoryObj } from '@storybook/react';
import Breadcrumb from '@/components/navigation/breadcrumbs/Breadcrumb';

const pages = [
  { name: 'Subjects', href: '#', current: false },
  { name: 'SUB0000000', href: '#', current: true },
];

const meta: Meta = {
  title: 'Naviagtion/Breadcrumbs',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const SimpleBreadcrumb: Story = {
  args: {
    pages,
  },
};
