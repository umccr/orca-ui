import { FC, ReactNode, useState } from 'react';
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/16/solid';
import { classNames } from '@/utils/commonUtils';

export interface SidebarProps {
  position: 'left' | 'right';
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ title, children, footer, position }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div
      className={classNames(
        'group relative flex h-full flex-col border-r border-gray-300 transition-all duration-300 dark:border-gray-700',
        isOpen ? 'w-96' : 'w-16',
        position === 'left' ? 'border-r' : 'border-l',
        position === 'left' ? 'left-0' : 'right-0'
      )}
    >
      {isOpen ? (
        <>
          <div className={`absolute ${position === 'left' ? 'right' : 'left'}-0 top-0 z-20 p-4`}>
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='rounded-lg bg-gray-50 p-1.5 text-gray-400 ring-1 ring-gray-200 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:bg-gray-700 dark:ring-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300'
            >
              <span className='sr-only'>Close sidebar</span>
              <ArrowRightStartOnRectangleIcon className='h-5 w-5' />
            </button>
          </div>

          {title && (
            <div className='sticky top-0 z-10 border-b border-inherit px-6 py-4'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>{title ?? ''}</h2>
            </div>
          )}

          <div className='flex-1 space-y-2 px-3 py-2'>{children}</div>

          {footer && <div className='px-3 py-2'>{footer}</div>}
        </>
      ) : (
        <div className={`absolute ${position === 'left' ? 'right' : 'left'}-0 top-0 z-20 p-3`}>
          <button
            type='button'
            onClick={() => setIsOpen(true)}
            className='rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:hover:bg-gray-700 dark:hover:text-gray-300'
          >
            <span className='sr-only'>Open sidebar</span>
            <ArrowLeftStartOnRectangleIcon className='h-5 w-5' />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
