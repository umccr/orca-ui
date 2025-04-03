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
        className='absolute top-0 left-[1px] z-50 h-[48px] w-[2px] bg-white transition-transform duration-300'
        style={{ transform: `translateY(${activeIndex * 56 + 40 + 2}px)` }} // header height 44px + mt-10 + space -y-2 + padding 4px + space -y-2
      />

      {/* list of module navigation */}

      <nav className='mt-10'>
        <ul role='list' className='flex w-full flex-1 flex-col items-center'>
          {navigation.map((item, index) => (
            <li key={index} className='h-[56px] w-full' onClick={() => setActiveIndex(index)}>
              <Link
                to={item.href}
                className={classNames(
                  'group text-2xs hover:bg-heritage-blue-50 flex flex-1 transform flex-col items-center p-[4px] leading-5 transition-colors duration-300',
                  location.pathname.includes(item.href)
                    ? 'font-semibold text-white'
                    : 'font-normal text-gray-300'
                )}
              >
                {location.pathname.includes(item.href) ? (
                  <item.solidIcon className='h-6 w-5 shrink-0 text-white' aria-hidden='true' />
                ) : (
                  <item.icon
                    className='h-6 w-5 shrink-0 stroke-2 text-gray-300'
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
