import { Link, useLocation } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';
import { FC, useState } from 'react';
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
}

const ModuleNavbar: FC<ModuleNavbarProps> = ({ navigation }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='relative flex grow-0 flex-col gap-y-5 overflow-y-auto bg-white min-w-14'>
      {isOpen ? (
        <>
          <button
            type='button'
            onClick={() => setIsOpen((p) => !p)}
            className='absolute right-0 top-0 m-4 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2'
          >
            <span className='absolute -inset-2.5' />
            <span className='sr-only'>Close panel</span>
            <XMarkIcon aria-hidden='true' className='h-6 w-6' />
          </button>
          <nav className='flex flex-1 flex-col'>
            <ul role='list' className='flex flex-1 flex-col space-y-1 px-1'>
              {navigation.map((item, index) => (
                <li key={index}>
                  {item.title ? (
                    <div className='pt-3 pb-3 pl-5 pr-6 text-xl font-medium'>{item.title}</div>
                  ) : (
                    <div className='pb-3'></div>
                  )}

                  {item.children.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        'group flex gap-x-3 py-2 px-10 text-sm rounded-md leading-6 font-normal text-magpie-dark-75 hover:bg-magpie-light-25',
                        item.href == location.pathname ? 'bg-magpie-light-25' : ''
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </li>
              ))}
            </ul>
          </nav>
        </>
      ) : (
        <button onClick={() => setIsOpen((p) => !p)} className='h-full hover:bg-gray-50 z-10'>
          <div className='absolute right-0 top-0 m-4 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2'>
            <Bars3Icon aria-hidden='true' className='h-6 w-6' />
          </div>
        </button>
      )}
    </div>
  );
};

export default ModuleNavbar;
