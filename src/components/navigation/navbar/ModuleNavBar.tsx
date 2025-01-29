import { Link, useLocation } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';
import { FC, useState, ReactNode, FunctionComponent, SVGProps } from 'react';
import { XMarkIcon } from '@heroicons/react/16/solid';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/common/tooltips';

export interface NavigationChildrenItem {
  name: string;
  href: string;
  icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  badge?: number; // For notification counts
}

export interface NavigationItem {
  title?: string;
  children: NavigationChildrenItem[];
}

export interface ModuleNavbarProps {
  navigation: NavigationItem[];
  footer?: ReactNode;
}

const ModuleNavbar: FC<ModuleNavbarProps> = ({ navigation, footer }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={classNames(
        'group relative flex h-full flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-800',
        isOpen ? 'w-72' : 'w-16'
      )}
    >
      {isOpen ? (
        <>
          <div className='absolute right-0 top-0 z-20 p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='rounded-lg bg-gray-50 p-1.5 text-gray-400 ring-1 ring-gray-200 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:bg-gray-700 dark:ring-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300'
            >
              <span className='sr-only'>Close sidebar</span>
              <XMarkIcon className='h-5 w-5' />
            </button>
          </div>

          <nav className='flex-1'>
            {navigation.map((item, index) => (
              <div key={index} className='mb-8 last:mb-0'>
                {item.title && (
                  <div className='sticky top-0 z-10 bg-white px-6 py-4 dark:bg-gray-800'>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                      {item.title}
                    </h2>
                  </div>
                )}

                <div className='space-y-2 px-3 py-2'>
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.href}
                      className={classNames(
                        'group flex items-center gap-x-3 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150',
                        location.pathname.includes(child.href)
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                      )}
                    >
                      {child.icon && (
                        <child.icon
                          className={classNames(
                            'h-5 w-5 shrink-0', // Increased icon size
                            location.pathname.includes(child.href)
                              ? 'text-blue-600 dark:text-blue-200'
                              : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300'
                          )}
                        />
                      )}
                      <span className='flex-1'>{child.name}</span>
                      {child.badge && (
                        <span className='ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-100 px-1.5 text-xs font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-200'>
                          {child.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {footer && (
            <div className='sticky bottom-0 border-t border-gray-200 bg-white px-3 py-3 dark:border-gray-700 dark:bg-gray-800'>
              {footer}
            </div>
          )}
        </>
      ) : (
        <>
          <div className='sticky top-0 z-10 flex h-16 items-center justify-center border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
            <button
              onClick={() => setIsOpen(true)}
              className='rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:hover:bg-gray-700 dark:hover:text-gray-300'
            >
              <span className='sr-only'>Open sidebar</span>
              <Bars3Icon className='h-5 w-5' aria-hidden='true' />
            </button>
          </div>

          <nav className='flex-1 space-y-1 px-2 py-4'>
            {navigation.map((item) =>
              item.children.map((child) => (
                <Link
                  key={child.name}
                  to={child.href}
                  className={classNames(
                    'group flex items-center justify-center rounded-md p-2 transition-colors duration-150',
                    location.pathname.includes(child.href)
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-200'
                      : 'text-gray-400 hover:bg-gray-50 hover:text-gray-500 dark:text-gray-400 dark:hover:bg-gray-700/50 dark:hover:text-gray-300'
                  )}
                >
                  <Tooltip text={child.name} position='right'>
                    {child.icon && <child.icon className='h-5 w-5' />}
                    <span className='sr-only'>{child.name}</span>
                  </Tooltip>
                </Link>
              ))
            )}
          </nav>
        </>
      )}
    </div>
  );
};

export default ModuleNavbar;
