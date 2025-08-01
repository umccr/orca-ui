import { FC, ReactNode } from 'react';
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/16/solid';
import { classNames } from '@/utils/commonUtils';
import { useUserPreferencesLocalStorage } from '@/hooks/useLocalStorage';

export interface SidebarProps {
  position: 'left' | 'right';
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  preferenceStorageKey?: string;
  openWidth?: string;
  collapsedWidth?: string;
  iconOnClosed?: ReactNode;
  iconOnOpen?: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({
  title,
  children,
  footer,
  position,
  className,
  preferenceStorageKey,
  openWidth = '',
  collapsedWidth = 'w-16',
  iconOnClosed,
  iconOnOpen,
}) => {
  const [isOpen, setIsOpen] = useUserPreferencesLocalStorage(
    preferenceStorageKey ?? 'sidebar-open',
    true
  );

  return (
    <aside
      className={classNames(
        'relative flex h-full flex-col',
        'border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-900',
        'transition-all duration-200 ease-in-out',
        position === 'left' ? 'border-r' : 'border-l',
        isOpen ? openWidth : collapsedWidth,
        className
      )}
    >
      {isOpen ? (
        <>
          <div
            className={classNames(
              'absolute z-20',
              'p-2',
              position === 'left' ? 'right-2' : 'left-2',
              'top-2'
            )}
          >
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className={classNames(
                'rounded-md p-2',
                'bg-white dark:bg-gray-900',
                'text-gray-500 dark:text-gray-400',
                'shadow-lg ring-1 ring-gray-200 dark:ring-gray-700',
                'hover:bg-gray-50 dark:hover:bg-gray-700',
                'hover:text-gray-700 dark:hover:text-gray-300',
                'focus:ring-2 focus:ring-blue-500/50 focus:outline-hidden',
                'transition-all duration-200'
              )}
            >
              <span className='sr-only'>Close sidebar</span>
              {iconOnClosed ? (
                iconOnClosed
              ) : position === 'left' ? (
                <ArrowLeftStartOnRectangleIcon className='h-4 w-4' />
              ) : (
                <ArrowRightStartOnRectangleIcon className='h-4 w-4' />
              )}
            </button>
          </div>

          {title && (
            <div className='sticky top-0 z-10 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'>
              <div className='px-6 py-4'>
                <h2 className='truncate text-lg font-semibold text-gray-900 dark:text-white'>
                  {title}
                </h2>
              </div>
            </div>
          )}

          <div className='flex-1'>
            <div className={classNames('space-y-2 p-4', position === 'left' ? 'pl-0' : 'pr-0')}>
              {children}
            </div>
          </div>

          {footer && (
            <div className='border-t border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50'>
              {footer}
            </div>
          )}
        </>
      ) : (
        <div
          className={classNames(
            'absolute z-20',
            'p-2',
            position === 'left' ? 'right-2' : 'left-2',
            'top-2'
          )}
        >
          <button
            type='button'
            onClick={() => setIsOpen(true)}
            className={classNames(
              'rounded-md p-2',
              'bg-white dark:bg-gray-900',
              'text-gray-500 dark:text-gray-400',
              'shadow-lg ring-1 ring-gray-200 dark:ring-gray-700',
              'hover:bg-gray-50 dark:hover:bg-gray-700',
              'hover:text-gray-700 dark:hover:text-gray-300',
              'focus:ring-2 focus:ring-blue-500/50 focus:outline-hidden',
              'transition-all duration-200'
            )}
          >
            <span className='sr-only'>Open sidebar</span>
            {iconOnOpen ? (
              iconOnOpen
            ) : position === 'left' ? (
              <ArrowRightStartOnRectangleIcon className='h-4 w-4' />
            ) : (
              <ArrowLeftStartOnRectangleIcon className='h-4 w-4' />
            )}
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
