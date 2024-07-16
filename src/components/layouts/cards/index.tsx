import React, { FC } from 'react';
import { classNames } from '@/utils/utils';

export type CardProps = {
  className?: string;
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const Card: FC<CardProps> = ({ className, header, children, footer }) => {
  return (
    <div
      className={classNames(
        'divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow',
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

export default Card;
