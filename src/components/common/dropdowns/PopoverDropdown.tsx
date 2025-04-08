import { FC, ReactNode } from 'react';
import { CloseButton, Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Card } from '../cards';

type Props = { btnChildren: ReactNode; content: ReactNode };

const PopoverDropdown: FC<Props> = ({ btnChildren, content }) => {
  return (
    <Popover className='relative flex h-full'>
      <PopoverButton as='div'>{btnChildren}</PopoverButton>
      <PopoverPanel anchor='bottom end' className='flex flex-col'>
        <Card className='mt-2 overflow-auto! border border-gray-400'>{content}</Card>
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
