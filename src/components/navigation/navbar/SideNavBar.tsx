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
    <div className=' bg-magpie-light-50 w-[68px] border-r-2 border-magpie-light-75'>
      <nav>
        <ul role='list' className='flex flex-1 flex-col items-center w-full'>
          {navigation.map((item) => (
            <li key={item.name} className='w-full hover:bg-magpie-light-50'>
              <Link
                to={item.href}
                className={classNames(
                  'group flex flex-1 flex-col items-center text-xs leading-6 font-semibold px-2 pt-3 pb-2 transition-colors duration-300 transform',
                  location.pathname.includes(item.href)
                    ? 'bg-magpie-light-100 text-heritage-blue-100'
                    : 'hover:bg-magpie-light-100 text-heritage-blue-75'
                )}
              >
                {location.pathname.includes(item.href) ? (
                  <item.solidIcon
                    className='h-6 w-6 shrink-0 text-heritage-blue-100'
                    aria-hidden='true'
                  />
                ) : (
                  <item.icon
                    className='h-6 w-6 shrink-0 text-heritage-blue-75'
                    aria-hidden='true'
                  />
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
