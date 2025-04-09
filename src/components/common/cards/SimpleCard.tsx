import { FC, ReactNode } from 'react';
import { classNames } from '@/utils/commonUtils';

export type CardProps = {
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  noPadding?: boolean;
};

const SimpleCard: FC<CardProps> = ({
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  header,
  children,
  footer,
  noPadding = false,
}) => {
  return (
    <div
      className={classNames(
        'overflow-hidden rounded-lg',
        'bg-white dark:bg-gray-900',
        'ring-1 ring-gray-200 dark:ring-gray-800',
        'shadow-sm hover:shadow-md',
        'transition-all duration-200',
        'divide-y divide-gray-200 dark:divide-gray-800',
        className
      )}
    >
      {header && (
        <div
          className={classNames(
            'bg-gray-50 dark:bg-gray-800/50',
            !noPadding && 'px-4 py-5 sm:px-6',
            headerClassName
          )}
        >
          {/* Header Content goes here */}
          {header}
        </div>
      )}
      <div
        className={classNames(
          !noPadding && 'px-4 py-5 sm:p-6',
          'bg-white dark:bg-gray-900',
          bodyClassName
        )}
      >
        {/* Body Content goes here */}
        {children}
      </div>
      {footer && (
        <div
          className={classNames(
            'bg-gray-50 dark:bg-gray-800/50',
            !noPadding && 'px-4 py-4 sm:px-6',
            footerClassName
          )}
        >
          {/* Footer Content goes here */}
          {footer}
        </div>
      )}
    </div>
  );
};

export default SimpleCard;
