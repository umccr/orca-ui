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
}

const SideNavbar: FC<SideNavbarProps> = ({ navigation }) => {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    const index = navigation.findIndex((item) => location.pathname.includes(item.href));
    setActiveIndex(index);
  }, [location.pathname, navigation]);

  return (
    <div className=' bg-magpie-light-50 w-[68px] border-0 border-magpie-light-75'>
      {/* slide indicator */}
      <div
        className='absolute z-50 left-[1px] top-0 w-[3px] h-[48px] bg-heritage-blue-100 transition-transform duration-300 '
        style={{ transform: `translateY(${activeIndex * 56 + 48}px)` }} // header height 44px + padding 4px
      />
      {/* list of module navigation */}

      <nav>
        <ul role='list' className='flex flex-1 flex-col items-center w-full'>
          {navigation.map((item, index) => (
            <li
              key={index}
              className='w-full h-[56px] hover:bg-magpie-light-100'
              onClick={() => setActiveIndex(index)}
            >
              <Link
                to={item.href}
                className={classNames(
                  'group flex flex-1 flex-col items-center text-xs leading-6 p-[4px] transition-colors duration-300 transform hover:bg-magpie-light-25',
                  location.pathname.includes(item.href)
                    ? ' text-heritage-blue-100 font-semibold '
                    : ' text-heritage-blue-75 font-normal '
                )}
              >
                {location.pathname.includes(item.href) ? (
                  <item.solidIcon
                    className='h-6 w-5 shrink-0 text-heritage-blue-100'
                    aria-hidden='true'
                  />
                ) : (
                  <item.icon
                    className='h-6 w-5 shrink-0 text-heritage-blue-75'
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
