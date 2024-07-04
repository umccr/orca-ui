import type { Meta, StoryObj } from '@storybook/react';
import Navbar from '@/components/navigation/navbar/NavBar';
import { withRouter, reactRouterParameters } from 'storybook-addon-remix-react-router';
import {
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon },
  {
    name: 'Teams',
    icon: UsersIcon,
    children: [
      { name: 'Engineering', href: '#' },
      { name: 'Human Resources', href: '#' },
      { name: 'Customer Success', href: '#' },
    ],
  },
  {
    name: 'Projects',
    icon: FolderIcon,
    children: [
      { name: 'GraphQL API', href: '#' },
      { name: 'iOS App', href: '#' },
      { name: 'Android App', href: '#' },
      { name: 'New Customer Portal', href: '#' },
    ],
  },
  { name: 'Calendar', href: '#', icon: CalendarIcon },
  { name: 'Documents', href: '#', icon: DocumentDuplicateIcon },
  { name: 'Reports', href: '#', icon: ChartPieIcon },
];

const meta: Meta = {
  title: 'Common/Navbar',
  component: Navbar,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { projectId: '42' },
        searchParams: { tab: 'smapleId' },
        state: { fromPage: 'portal' },
      },
      routing: {
        path: '/potal/project/:projectId',
        handle: 'portal',
      },
    }),
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // argTypes: {
  //   backgroundColor: { control: 'color' },
  // },
  // // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
  decorators: [withRouter],
};

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const SimpleNavbar: Story = {
  args: {
    navigation,
  },
};
