import { CircleStackIcon, ChartBarIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import {
  CircleStackIcon as SolidCircleStackIcon,
  CloudArrowUpIcon as SolidCloudArrowUpIcon,
  ChartBarIcon as SolidChartBarIcon,
} from '@heroicons/react/20/solid';
import { AppURLs } from './appURLs';

const sideNavigation = [
  { name: 'Lab', icon: CircleStackIcon, solidIcon: SolidCircleStackIcon, href: AppURLs.Lab },
  { name: 'Runs', icon: ChartBarIcon, solidIcon: SolidChartBarIcon, href: AppURLs.Runs },
  {
    name: 'sscheck',
    icon: CloudArrowUpIcon,
    solidIcon: SolidCloudArrowUpIcon,
    href: AppURLs.Sscheck,
  },
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
    title: 'Runs',
    children: [
      { name: 'Sequence', href: AppURLs.RunsSequence },
      // { name: 'Library', href: AppURLs.RunsLibrary },
      { name: 'Workflow', href: AppURLs.RunsWorkflow },
    ],
  },
];

export default sideNavigation;
export { libraryModuleNavigation, runsModuleNavigation };
