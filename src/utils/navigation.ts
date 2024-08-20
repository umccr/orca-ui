import { CircleStackIcon, ArrowPathIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import {
  CircleStackIcon as SolidCircleStackIcon,
  CloudArrowUpIcon as SolidCloudArrowUpIcon,
} from '@heroicons/react/24/solid';

const sideNavigation = [
  { name: 'Lab', icon: CircleStackIcon, solidIcon: SolidCircleStackIcon, href: '/lab' },
  { name: 'Runs', icon: ArrowPathIcon, solidIcon: ArrowPathIcon, href: '/runs' },
  { name: 'sscheck', icon: CloudArrowUpIcon, solidIcon: SolidCloudArrowUpIcon, href: '/sscheck' },
];

const libraryModuleNavigation = [
  {
    title: 'Library',
    children: [
      { name: 'Overview', href: '/lab/library/overview' },
      { name: 'File View', href: '/lab/library/fileview' },
    ],
  },
  {
    title: 'Reports',
    children: [
      { name: 'WGS', href: '/lab/library/reports/wgs' },
      { name: 'WTS', href: '/lab/library/reports/wts' },
      { name: 'TSO500', href: '/lab/library/reports/tso500' },
      { name: 'TSO500 (V2)', href: '/lab/library/reports/tso500v2' },
      { name: 'WGS (bcbio)', href: '/lab/library/reports/wgsbcbio' },
      { name: 'WTS (bcbio)', href: '/lab/library/reports/wtsbcbio' },
      { name: 'WGS (sash)', href: '/lab/library/reports/wgssash' },
    ],
  },
];

const runsModuleNavigation = [
  {
    children: [
      { name: 'Sequence', href: '/runs/sequence/' },
      { name: 'Library', href: '/runs/library/' },
      { name: 'Workflow', href: '/runs/workflow/' },
    ],
  },
];

export default sideNavigation;
export { libraryModuleNavigation, runsModuleNavigation };
