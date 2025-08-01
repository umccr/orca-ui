import { Table, GroupedTable, GroupedStackTable } from '@/components/tables';

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
      { header: 'Name', accessor: 'name', sortDirection: 'desc', onSort: () => {} },
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
      { header: 'Name', accessor: 'name', onSort: () => {} },
      { header: 'Title', accessor: 'title', onSort: () => {} },
      {
        header: 'Email',
        accessor: 'email',
        sortDirection: 'desc',
        onSort: () => {},
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
      { header: 'Name', accessor: 'name', onSort: () => {} },
      { header: 'Title', accessor: 'title', onSort: () => {} },
      {
        header: 'Email',
        accessor: 'email',
        onSort: () => {},
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
          cell: (data: unknown) => (
            <div>
              <span>Custom Node example</span>
              <div className='text-red-600'>{String(data)}</div>
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

export const GroupedStackTableExample: Story = {
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
          cell: (data: unknown) => (
            <div>
              <span>Custom Node example</span>
              <div className='text-red-600'>{String(data)}</div>
            </div>
          ),
        },
      ],
      tableData: [
        {
          groupTitle: {
            name: 'Group 1',
            title: 'Group 1',
            email: 'xx@example.com',
          },
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
          groupTitle: {
            name: 'Group 2',
            title: 'Group 2',
            email: 'xx@example.com',
          },
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

    return <GroupedStackTable {...args} />;
  },
};
