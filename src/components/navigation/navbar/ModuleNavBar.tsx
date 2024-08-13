import { Link, useLocation } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';
import { FC } from 'react';

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
  return (
    <div className='flex grow-0 flex-col gap-y-5 overflow-y-auto  bg-white min-w-40'>
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
                    item.href == location.pathname ? 'bg-magpie-light-25 curs' : ''
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
