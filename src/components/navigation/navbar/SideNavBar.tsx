import { Link, useLocation } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';
import { FC, useState, useEffect, FunctionComponent, SVGProps } from 'react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement>>;
  solidIcon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export interface SideNavbarProps {
  navigation: NavigationItem[];
  className?: string;
}

const SideNavbar: FC<SideNavbarProps> = ({ navigation, className }) => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const index = navigation.findIndex((item) => location.pathname.includes(item.href));
    setActiveIndex(index);
  }, [location.pathname, navigation]);

  return (
    <div className={`bg-heritage-blue-100 border-0 ${className ?? ''}`}>
      {/* slide indicator */}
      <div
        className='absolute z-50 left-[1px] top-0 w-[2px] h-[48px] bg-white transition-transform duration-300 '
        style={{ transform: `translateY(${activeIndex * 56 + 48 + 40 + 2}px)` }} // header height 44px + mt-10 + space -y-2 + padding 4px + space -y-2
      />

      {/* list of module navigation */}

      <nav className='mt-10'>
        <ul role='list' className='flex flex-1 flex-col items-center w-full'>
          {navigation.map((item, index) => (
            <li key={index} className='w-full h-[56px] ' onClick={() => setActiveIndex(index)}>
              <Link
                to={item.href}
                className={classNames(
                  'group flex flex-1 flex-col items-center text-2xs leading-5 p-[4px] transition-colors duration-300 transform hover:bg-heritage-blue-50',
                  location.pathname.includes(item.href)
                    ? ' text-white font-semibold '
                    : ' text-gray-300 font-normal '
                )}
              >
                {location.pathname.includes(item.href) ? (
                  <item.solidIcon className='h-6 w-5 shrink-0 text-white' aria-hidden='true' />
                ) : (
                  <item.icon
                    className='h-6 w-5 shrink-0 text-gray-300 stroke-2'
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
