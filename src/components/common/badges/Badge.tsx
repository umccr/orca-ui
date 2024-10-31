import { RequireAtLeastOne } from 'type-fest';
import { ReactNode } from 'react';
import { classNames } from '@/utils/commonUtils';
export interface BadgePropsInterface {
  children: ReactNode;
  type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'abort' | 'unknown' | 'runing';
  status: string;
  className?: string;
}

type BadgeProps = RequireAtLeastOne<BadgePropsInterface, 'type' | 'status'>;

const Badge = ({ children, type = 'primary', status, className }: BadgeProps) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ';

  const badgetype = status ? getBadgeType(status) : type;
  const colorStyles: { [key: string]: string } = {
    primary: 'text-indigo-700 bg-indigo-100 ring-1 ring-inset ring-indigo-700/10 ',
    secondary: 'text-sky-700 bg-sky-100 ring-1 ring-inset ring-sky-700/10 ',
    success: 'text-green-700 bg-green-100 ring-1 ring-inset ring-green-700/10 ',
    fail: 'text-red-700 bg-red-100 ring-1 ring-inset ring-red-700/10 ',
    warning: 'text-yellow-700 bg-yellow-100 ring-1 ring-inset ring-yellow-700/10 ',
    abort: 'text-gray-700 bg-gray-100 ring-1 ring-inset ring-gray-700/10 ',
    unknown: 'text-gray-700 bg-gray-100 ring-1 ring-inset ring-gray-700/10 ',
    running: 'text-blue-700 bg-blue-100 ring-1 ring-inset ring-blue-700/10 ',
  };

  return (
    <span className={classNames(baseStyles, colorStyles[badgetype], className)}>{children}</span>
  );
};

export const getBadgeType = (status: string) => {
  switch (status.toUpperCase()) {
    case 'REQUESTED':
    case 'QUEUED':
      return 'primary';

    case 'INITIALIZING':
    case 'PREPARING_INPUTS':
    case 'IN PROGRESS':
    case 'READY':
    case 'GENERATING_OUTPUTS':
      return 'running';

    case 'ABORTING':
      return 'abort';
    case 'ABORTED':
      return 'abort';

    case 'FAILED':
      return 'fail';
    case 'SUCCEEDED':
      return 'success';
    default:
      return 'unknown';
  }
};

export default Badge;
