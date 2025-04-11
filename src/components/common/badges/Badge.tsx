import { RequireAtLeastOne } from 'type-fest';
import { ReactNode } from 'react';
import { classNames } from '@/utils/commonUtils';
import { getBadgeStatusType } from '@/utils/statusUtils';

export interface BadgePropsInterface {
  children: ReactNode;
  type:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'abort'
    | 'unknown'
    | 'running';
  status: string;
  className?: string;
}

type BadgeProps = RequireAtLeastOne<BadgePropsInterface, 'type' | 'status'>;

const Badge = ({ children, type = 'primary', status, className }: BadgeProps) => {
  const baseStyles = classNames(
    'inline-flex items-center whitespace-nowrap rounded-full text-xs font-medium ring-1 ring-inset',
    'px-2.5 py-1',
    'transition-all duration-200 ease-in-out'
  );

  const badgetype = status ? getBadgeStatusType(status) : type;
  const colorStyles: { [key: string]: string } = {
    primary: classNames(
      'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
      'dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30'
    ),
    secondary: classNames(
      'bg-sky-50 text-sky-700 ring-sky-600/20',
      'dark:bg-sky-400/10 dark:text-sky-400 dark:ring-sky-400/30'
    ),
    success: classNames(
      'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
      'dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/30'
    ),
    fail: classNames(
      'bg-red-50 text-red-700 ring-red-600/20',
      'dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/30'
    ),
    warning: classNames(
      'bg-amber-50 text-amber-700 ring-amber-600/20',
      'dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/30',
      'hover:bg-amber-100 dark:hover:bg-amber-400/20'
    ),
    abort: classNames(
      'bg-zinc-50 text-zinc-700 ring-zinc-600/20',
      'dark:bg-zinc-400/10 dark:text-zinc-400 dark:ring-zinc-400/30'
    ),
    unknown: classNames(
      'bg-gray-50 text-gray-700 ring-gray-600/20',
      'dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/30'
    ),
    running: classNames(
      'bg-blue-50 text-blue-700 ring-blue-600/20',
      'dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30'
    ),
  };

  return (
    <span className={classNames(baseStyles, colorStyles[badgetype], className)}>{children}</span>
  );
};

export default Badge;
