import type { Meta, StoryObj } from '@storybook/react';
import Navbar from '@/components/navigation/navbar/NavBar';
import { withRouter, reactRouterParameters } from 'storybook-addon-remix-react-router';
import {
  DocumentTextIcon,
  ChartBarSquareIcon,
  Bars3BottomLeftIcon,
  BookOpenIcon,
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Metadata', href: '#', icon: DocumentTextIcon },
  {
    name: 'Subjects',
    icon: ChartBarSquareIcon,
    children: [
      { name: 'Overview', href: '#' },
      { name: 'Files', href: '#' },
      { name: 'Reports', href: '#' },
    ],
  },
  {
    name: 'Library',
    icon: BookOpenIcon,
    children: [
      { name: 'Overview', href: '#' },
      { name: 'Files', href: '#' },
    ],
  },
  {
    name: 'Sequence',
    icon: Bars3BottomLeftIcon,
    children: [
      { name: 'Overview', href: '#' },
      { name: 'Files', href: '#' },
    ],
  },
  { name: 'Workflow', href: '#', icon: ArrowPathRoundedSquareIcon },
  { name: 'Data Journey', href: '#', icon: ArrowsRightLeftIcon },
];

const meta: Meta = {
  title: 'Naviagtion/Navbar',
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
