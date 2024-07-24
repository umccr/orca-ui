import {
  DocumentTextIcon,
  ChartBarSquareIcon,
  Bars3BottomLeftIcon,
  BookOpenIcon,
  ArrowPathRoundedSquareIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Metadata', href: '/metadata', icon: DocumentTextIcon },
  {
    name: 'Subjects',
    icon: ChartBarSquareIcon,
    children: [
      { name: 'Overview', href: '#' },
      { name: 'Files', href: '#' },
      { name: 'Reports', href: '#' },
    ],
    href: '#',
  },
  {
    name: 'Library',
    icon: BookOpenIcon,
    children: [
      { name: 'Overview', href: '#' },
      { name: 'Files', href: '#' },
    ],
    href: '#',
  },
  {
    name: 'Sequence',
    icon: Bars3BottomLeftIcon,
    children: [
      { name: 'Overview', href: '#' },
      { name: 'Files', href: '#' },
    ],
    href: '#',
  },
  { name: 'Workflow', href: '#', icon: ArrowPathRoundedSquareIcon },
  { name: 'Data Journey', href: '#', icon: ArrowsRightLeftIcon },
];

export default navigation;
