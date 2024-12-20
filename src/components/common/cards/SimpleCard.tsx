import { FC, ReactNode } from 'react';
import { classNames } from '@/utils/commonUtils';

export type CardProps = {
  className?: string;
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

const SimpleCard: FC<CardProps> = ({ className, header, children, footer }) => {
  return (
    <div
      className={classNames(
        'divide-y divide-gray-200 overflow-hidden rounded-lg bg-white',
        className ? className : ''
      )}
    >
      {header && (
        <div className='px-4 py-5 sm:px-6'>
          {/* Header Content goes here */}
          {header}
        </div>
      )}
      <div className='px-4 py-5 sm:p-6'>
        {/* Body Content goes here */}
        {children}
      </div>
      {footer && (
        <div className='px-4 py-4 sm:px-6'>
          {/* Footer Content goes here */}
          {footer}
        </div>
      )}
    </div>
  );
};

export default SimpleCard;
