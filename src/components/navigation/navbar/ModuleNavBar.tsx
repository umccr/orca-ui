import { Link, useLocation } from 'react-router-dom';
import { classNames } from '@/utils/utils';
import { FC } from 'react';

export interface NavigationChildrenItem {
  name: string;
  href: string;
}

export interface NavigationItem {
  name?: string;
  children: NavigationChildrenItem[];
}

export interface ModuleNavbarProps {
  navigation: NavigationItem[];
}

const ModuleNavbar: FC<ModuleNavbarProps> = ({ navigation }) => {
  const location = useLocation();

  return (
    <div className='flex grow-0 flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white min-w-40'>
      <nav className='flex flex-1 flex-col'>
        <ul role='list' className='flex flex-1 flex-col gap-y-7 space-y-1 px-1'>
          {navigation.map((item, index) => (
            <li key={index}>
              {item.name && (
                <div className='pt-6 pb-3 pl-5 pr-6 text-xl font-medium'>{item.name}</div>
              )}

              {item.children.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    'group flex gap-x-3 py-2 px-10 text-sm rounded-md leading-6 font-semibold text-magpie-dark-75',
                    item.href == location.pathname
                      ? 'bg-magpie-light-50'
                      : 'hover:bg-magpie-light-25'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default ModuleNavbar;
