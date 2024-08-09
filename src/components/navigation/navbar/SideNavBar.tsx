import { Link, useLocation } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';
import { FC } from 'react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  solidIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

export interface SideNavbarProps {
  navigation: NavigationItem[];
}

const SideNavbar: FC<SideNavbarProps> = ({ navigation }) => {
  const location = useLocation();

  return (
    <div className=' bg-heritage-blue-100'>
      <nav>
        <ul role='list' className='flex flex-1 flex-col items-center w-full'>
          {navigation.map((item) => (
            <li key={item.name} className='w-full hover:bg-heritage-blue-75'>
              <Link
                to={item.href}
                className={classNames(
                  'group flex flex-1 flex-col items-center text-sm leading-6 font-semibold px-1 py-2 transition-colors duration-200 transform',
                  location.pathname.includes(item.href)
                    ? 'bg-white text-heritage-blue-100'
                    : 'hover:bg-heritage-blue-75 text-white'
                )}
              >
                {location.pathname.includes(item.href) ? (
                  <item.solidIcon
                    className='h-6 w-6 shrink-0 text-heritage-blue-75'
                    aria-hidden='true'
                  />
                ) : (
                  <item.icon className='h-6 w-6 shrink-0 text-white' aria-hidden='true' />
                )}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SideNavbar;
