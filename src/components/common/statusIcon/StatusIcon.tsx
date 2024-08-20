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
} from '@heroicons/react/24/outline';

const StatusIcon: FC<{ status: string; className?: string }> = ({ status, className }) => {
  const iconStyles = 'h-5 w-5 flex ' + className;

  switch (status.toUpperCase()) {
    case 'REQUESTED':
      return (
        <ArrowRightCircleIcon
          className={'text-kookaburra-light-100 ' + iconStyles}
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
          className={iconStyles + ' h-[17px] w-[17px] animate-spin text-kookaburra-light-100'}
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
      return <StopCircleIcon className={iconStyles + ' text-sheoak-light-50'} title='Aborted' />;
    case 'FAILED':
      return <XCircleIcon className={iconStyles + ' text-sheoak-light-50'} title='Failed' />;
    case 'COMPLETED':
    case 'SUCCEEDED':
      return (
        <CheckCircleIcon className={iconStyles + ' text-yam-daisy-yellow-75'} title='Completed' />
      );
    case 'UNKNOWN':
      return (
        <ExclamationCircleIcon className={iconStyles + ' text-sheoak-light-50'} title='Unknown' />
      );
    default:
      return (
        <ExclamationCircleIcon className={iconStyles + ' text-sheoak-light-50'} title='Unknown' />
      );
  }
};

export default StatusIcon;
