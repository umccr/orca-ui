import { JsonToTable } from '@/components/common/json-to-table';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Common/JsonToTable',
  component: JsonToTable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockJson = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  age: 29,
  street: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zip: '12345',
  phoneNumbers: ['555-555-5555', '555-555-5556'],
  isActive: true,
  createdAt: '2023-10-01T12:34:56Z',
};

export const SimpleJsonToTable: Story = {
  render: () => {
    return (
      <>
        <JsonToTable data={mockJson} />
      </>
    );
  },
};
