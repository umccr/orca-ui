import { Link, useLocation } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';
import { FC, useState, ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/16/solid';
import { Bars3Icon } from '@heroicons/react/24/outline';

export interface NavigationChildrenItem {
  name: string;
  href: string;
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
        'relative flex grow-0 flex-col gap-y-5 overflow-y-auto border-r transition-all duration-300',
        isOpen
          ? 'min-w-64 bg-white shadow-sm dark:bg-gray-800'
          : 'min-w-16 bg-gray-50 dark:bg-gray-900'
      )}
    >
      {isOpen ? (
        <>
          <button
            type='button'
            onClick={() => setIsOpen((p) => !p)}
            className='absolute right-0 top-0 m-4 mt-6 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-300 dark:focus:ring-offset-gray-800'
          >
            <span className='absolute -inset-2.5' />
            <span className='sr-only'>Close panel</span>
            <XMarkIcon aria-hidden='true' className='h-5 w-5' />
          </button>
          <nav className='flex flex-1 flex-col'>
            <ul role='list' className='flex flex-1 flex-col space-y-1 px-3'>
              {navigation.map((item, index) => (
                <li key={index} className='gap-2'>
                  {item.title ? (
                    <div className='px-4 pb-2 pt-6 text-sm font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300'>
                      {item.title}
                    </div>
                  ) : (
                    <div className='pb-2'></div>
                  )}

                  {item.children.map((item) => (
                    <div key={item.name} className='py-0.5'>
                      <Link
                        to={item.href}
                        className={classNames(
                          'group flex items-center rounded-md px-4 py-2 text-sm font-medium leading-6 transition-colors duration-150',
                          location.pathname.includes(item.href)
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-gray-100'
                        )}
                      >
                        {item.name}
                      </Link>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </nav>

          {footer && <div className='px-3 pb-3'>{footer}</div>}
        </>
      ) : (
        <button
          onClick={() => setIsOpen((p) => !p)}
          className='h-full w-full transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-800'
        >
          <div className='sticky top-0 p-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300'>
            <Bars3Icon aria-hidden='true' className='h-5 w-5' />
          </div>
        </button>
      )}
    </div>
  );
};

export default ModuleNavbar;
