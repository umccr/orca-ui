import { Link, useLocation } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';
import { FC, useState, ReactNode, FunctionComponent, SVGProps } from 'react';
import { XMarkIcon } from '@heroicons/react/16/solid';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/common/tooltips';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface NavigationChildrenItem {
  name: string;
  href: string;
  icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  badge?: number; // For notification counts
  isCurrent?: boolean;
}

export interface NavigationItem {
  title?: string;
  children: NavigationChildrenItem[];
}

export interface ModuleNavbarProps {
  navigation: NavigationItem[];
  footer?: ReactNode;
  preferenceStorageKey?: string;
}

const ModuleNavbar: FC<ModuleNavbarProps> = ({ navigation, footer, preferenceStorageKey }) => {
  const location = useLocation();
  const [isOpenNavbar, setIsOpenNavbar] = useLocalStorage(
    preferenceStorageKey ?? 'isOpenNavbar',
    true
  );

  const [isOpen, setIsOpen] = useState(isOpenNavbar);

  const toggleIsOpenNavbar = () => {
    setIsOpen(!isOpenNavbar);
    setIsOpenNavbar(!isOpenNavbar);
  };

  return (
    <div
      className={classNames(
        'group relative flex h-full flex-col border-r border-gray-200 bg-gray-50 transition-all duration-300 dark:border-gray-700 dark:bg-gray-900',
        isOpen ? 'w-72' : 'w-16'
      )}
    >
      {isOpen ? (
        <>
          <div className='absolute right-0 top-0 z-20 p-4'>
            <button
              type='button'
              onClick={toggleIsOpenNavbar}
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
                  <div className='sticky top-0 z-10 bg-gray-50 px-6 py-4 dark:bg-gray-800'>
                    <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                      {item.title}
                    </h2>
                  </div>
                )}

                <div className='space-y-2 px-3 py-2'>
                  {item.children.map((child) => {
                    const isSelected = child.isCurrent ?? location.pathname.includes(child.href);
                    return (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={classNames(
                          'group flex items-center gap-x-3 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-150',
                          isSelected
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-200'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
                        )}
                      >
                        {child.icon && (
                          <child.icon
                            className={classNames(
                              'h-5 w-5 shrink-0',
                              isSelected
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
                    );
                  })}
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
              onClick={toggleIsOpenNavbar}
              className='rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:hover:bg-gray-700 dark:hover:text-gray-300'
            >
              <span className='sr-only'>Open sidebar</span>
              <Bars3Icon className='h-5 w-5' aria-hidden='true' />
            </button>
          </div>

          <nav className='flex-1 space-y-1 px-2 py-4'>
            {navigation.map((item, index) => (
              <div key={index}>
                {item.children.map((child) => (
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
                      {child.icon ? (
                        <child.icon className='h-5 w-5' />
                      ) : (
                        <div className='flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300'>
                          {child.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className='sr-only'>{child.name}</span>
                    </Tooltip>
                  </Link>
                ))}
                {index < navigation.length - 1 && (
                  <div className='my-2 h-px bg-gray-200 dark:bg-gray-700' />
                )}
              </div>
            ))}
          </nav>
        </>
      )}
    </div>
  );
};

export default ModuleNavbar;
