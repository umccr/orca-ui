import React, { FC, ReactNode } from 'react';
import { CloseButton, Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Card } from '../cards';

type Props = { btnChildren: ReactNode; content: ReactNode };

const PopoverDropdown: FC<Props> = ({ btnChildren, content }) => {
  return (
    <Popover className='relative h-full flex'>
      <PopoverButton>{btnChildren}</PopoverButton>
      <PopoverPanel anchor='bottom end' className='flex flex-col'>
        <Card className='border border-gray-400 mt-2'>{content}</Card>
      </PopoverPanel>
    </Popover>
  );
};

export const ClosePopoverWrapper = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <CloseButton as={'div'} className={className}>
      {children}
    </CloseButton>
  );
};

export default PopoverDropdown;
