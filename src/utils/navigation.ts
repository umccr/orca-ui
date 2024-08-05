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

const subjectModuleNavigation = [
  {
    name: 'Subject',
    children: [
      { name: 'Overview', href: '/lab/subject/overview' },
      { name: 'Launch Pad', href: '/lab/subject/launchpad' },
    ],
  },
  {
    name: 'Reports',
    children: [
      { name: 'WGS', href: '/lab/subject/reports/wgs' },
      { name: 'WTS', href: '/lab/subject/reports/wts' },
      { name: 'TSO500', href: '/lab/subject/reports/tso500' },
      { name: 'TSO500 (V2)', href: '/lab/subject/reports/tso500v2' },
      { name: 'WGS (bcbio)', href: '/lab/subject/reports/wgsbcbio' },
      { name: 'WTS (bcbio)', href: '/lab/subject/reports/wtsbcbio' },
      { name: 'WGS (sash)', href: '/lab/subject/reports/wgssash' },
    ],
  },
];
const libraryModuleNavigation = [
  {
    name: 'Library',
    children: [
      { name: 'Overview', href: '/lab/library/overview' },
      { name: 'File View', href: '/lab/library/fileview' },
    ],
  },
];

const runsModuleNavigation = [
  {
    children: [
      { name: 'Sequence', href: '/runs/Sequence' },
      { name: 'Library', href: '/runs/library' },
      {
        name: 'Workflow',
        href: '/runs/workflow',
      },
    ],
  },
];

export default sideNavigation;
export { subjectModuleNavigation, libraryModuleNavigation, runsModuleNavigation };
