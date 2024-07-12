import Card from '@/components/layouts/cards/Card';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Layouts/Cards',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleCard: Story = {
  args: {
    body: 'This is a simple card',
  },
};

export const WithHeaderFooter: Story = {
  args: {
    header: 'Header',
    body: 'This is a simple card',
    footer: 'Footer',
  },
};
