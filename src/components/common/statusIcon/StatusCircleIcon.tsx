import { FC } from 'react';
import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  PlayCircleIcon,
  StopIcon,
  XCircleIcon,
  StopCircleIcon,
  ArrowRightCircleIcon,
  CloudArrowDownIcon,
  ArrowDownOnSquareIcon,
} from '@heroicons/react/24/solid';

interface StatusCircleIconProps {
  status: string;
  className?: string;
}

const StatusCircleIcon: FC<StatusCircleIconProps> = ({ status, className }) => {
  const iconStyles = 'h-9 w-9 ' + className;

  switch (status.toUpperCase()) {
    case 'REQUESTED':
      return (
        <ArrowRightCircleIcon
          className={iconStyles + ' text-kookaburra-light-100'}
          title='Requested'
        />
      );
    case 'QUEUED':
      return <ClockIcon className={iconStyles + ' text-magpie-dark-50'} title='Queued' />;
    case 'INITIALIZING':
      return (
        <PlayCircleIcon className={iconStyles + ' text-magpie-dark-75'} title='Initializing' />
      );
    case 'PREPARING_INPUTS':
      return (
        <CloudArrowDownIcon
          className={iconStyles + ' text-yam-daisy-yellow-75'}
          title='Preparing Inputs'
        />
      );
    case 'IN_PROGRESS':
      return (
        <ArrowPathIcon
          className={iconStyles + ' animate-spin text-kookaburra-light-100'}
          title='In Progress'
        />
      );
    case 'GENERATING_OUTPUTS':
      return (
        <ArrowDownOnSquareIcon
          className={iconStyles + ' text-yam-daisy-yellow-75'}
          title='Generating outputs'
        />
      );
    case 'ABORTING':
      return <StopIcon className={iconStyles + ' text-sheoak-light-50'} title='Aborting' />;
    case 'ABORTED':
      return <StopCircleIcon className={iconStyles + ' text-sheoak-light-75'} title='Aborted' />;
    case 'FAILED':
      return <XCircleIcon className={iconStyles + ' text-sheoak-light-100'} title='Failed' />;
    case 'SUCCEEDED':
      return <CheckCircleIcon className={iconStyles + ' text-red-gum-dark-75'} title='Succeeded' />;
    default:
      return (
        <ExclamationCircleIcon
          className={iconStyles + ' text-magpie-light-100'}
          title='Unknown Status'
        />
      );
  }
};

export default StatusCircleIcon;
