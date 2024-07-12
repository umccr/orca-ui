import React, { FC } from 'react';

export type CardProps = {
  header?: React.ReactNode;
  body: React.ReactNode;
  footer?: React.ReactNode;
};

const Card: FC<CardProps> = ({ header, body, footer }) => {
  return (
    <div className='divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow'>
      {header && (
        <div className='px-4 py-5 sm:px-6'>
          {/* Header Content goes here */}
          {header}
        </div>
      )}
      <div className='px-4 py-5 sm:p-6'>
        {/* Body Content goes here */}
        {body}
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
