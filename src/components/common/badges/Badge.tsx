import { RequireAtLeastOne } from 'type-fest';
export interface BadgePropsInterface {
  children: React.ReactNode;
  type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'abort' | 'unknown' | 'runing';
  status: string;
  className?: string;
}

type BadgeProps = RequireAtLeastOne<BadgePropsInterface, 'type' | 'status'>;

const Badge = ({ children, type = 'primary', status, className }: BadgeProps) => {
  const baseStyles = 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ';

  const badgetype = status ? getBadgeType(status) : type;
  const colorStyles: { [key: string]: string } = {
    primary: 'text-white bg-blue-700 ',
    secondary: 'text-blue-700 bg-blue-50 ring-1 ring-inset ring-blue-700/10 ',
    success: 'text-white bg-green-700 ',
    fail: 'text-white bg-red-700 ',
    warning: 'text-white bg-yellow-400 ',
    abort: 'text-gray-600 bg-grey-100 ',
    unknown: 'text-white bg-gray-500 ',
    running: 'text-white bg-blue-500 ',
  };

  return <span className={`${baseStyles} ${colorStyles[badgetype]} ${className}`}>{children}</span>;
};

const getBadgeType = (status: string) => {
  switch (status.toUpperCase()) {
    case 'REQUESTED':
      return 'primary';
    case 'QUEUED':
      return 'secondary';
    case 'INITIALIZING':
      return 'secondary';
    case 'PREPARING INPUTS':
      return 'secondary';
    case 'IN PROGRESS':
      return 'running';
    case 'GENERATING OUTPUTS':
      return 'secondary';
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
