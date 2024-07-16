import Table, { GroupedTable } from '@/components/tables';

import { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Tables/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleTable: Story = {
  args: {
    tableHeader: 'People',
    tableDescription: 'List of people in the company',
    columns: [
      { header: 'Name', accessor: 'name', sortable: true },
      { header: 'Title', accessor: 'title' },
      {
        header: 'Email',
        accessor: 'email',
      },
    ],
    tableData: [
      {
        name: 'John Doe',
        title: 'CEO',
        email: 'xxx@example.com',
      },
      {
        name: 'Jane Doe',
        title: 'CTO',
        email: 'xxx@example.com',
      },
      {
        name: 'John Smith',
        title: 'Developer',
        email: null,
      },
    ],
  },
};

export const StripedTable: Story = {
  args: {
    tableHeader: 'People',
    tableDescription: 'List of people in the company',
    columns: [
      { header: 'Name', accessor: 'name', sortable: true },
      { header: 'Title', accessor: 'title', sortable: true },
      {
        header: 'Email',
        accessor: 'email',
        sortable: true,
        cell: (data: string | number) => (
          <div>
            <span>Custom Node example</span>
            <div className='text-red-600'>{data}</div>
          </div>
        ),
      },
    ],
    tableData: [
      {
        name: 'John Doe',
        title: 'CEO',
        email: '1111@example.com',
      },
      {
        name: 'Jane Doe',
        title: 'CTO',
        email: '2222@example.com',
      },
      {
        name: 'John Smith',
        title: 'Developer',
        email: '3333@example.com',
      },
    ],
    striped: true,
  },
};

export const FullWidthTable: Story = {
  args: {
    tableHeader: 'People',
    tableDescription: 'List of people in the company',
    columns: [
      { header: 'Name', accessor: 'name', sortable: true },
      { header: 'Title', accessor: 'title', sortable: true },
      {
        header: 'Email',
        accessor: 'email',
        sortable: true,
        cell: (data: string | number) => (
          <div>
            <span>Custom Node example</span>
            <div className='text-red-600'>{data}</div>
          </div>
        ),
      },
    ],
    tableData: [
      {
        name: 'John Doe',
        title: 'CEO',
        email: '1111@example.com',
      },
      {
        name: 'Jane Doe',
        title: 'CTO',
        email: '2222@example.com',
      },
      {
        name: 'John Smith',
        title: 'Developer',
        email: '3333@example.com',
      },
    ],
    striped: true,
    inCard: false,
  },
};

export const GroupedRowTableExample: Story = {
  render: () => {
    const args = {
      tableHeader: 'People',
      tableDescription: 'List of people in the company',
      columns: [
        { header: 'Name', accessor: 'name' },
        { header: 'Title', accessor: 'title' },
        {
          header: 'Email',
          accessor: 'email',
          cell: (data: string | number) => (
            <div>
              <span>Custom Node example</span>
              <div className='text-red-600'>{data}</div>
            </div>
          ),
        },
      ],
      tableData: [
        {
          groupTitle: 'Group 1',
          groupData: [
            {
              name: 'John Doe',
              title: 'CEO',
              email: 'xx@example.com',
            },
            {
              name: 'Jane Doe',
              title: 'CTO',
              email: 'xx@example.com',
            },
            {
              name: 'John Smith',
              title: 'Developer',
              email: 'xx@example.com',
            },
          ],
        },
        {
          groupTitle: 'Group 2',
          groupData: [
            {
              name: 'John Doe',
              title: 'CEO',
              email: 'xx@example.com',
            },
            {
              name: 'Jane Doe',
              title: 'CTO',
              email: 'xx@example.com',
            },
            {
              name: 'John Smith',
              title: 'Developer',
              email: 'xx@example.com',
            },
          ],
        },
      ],
    };

    return <GroupedTable {...args} />;
  },
};
