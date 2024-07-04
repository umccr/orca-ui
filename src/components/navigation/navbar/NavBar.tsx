import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { useLocation } from 'react-router-dom';
import { FC } from 'react';

export interface NavigationItem {
  name: string;
  href?: string;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  children?: NavigationItem[];
}

export interface NavbarProps {
  navigation: NavigationItem[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const Navbar: FC<NavbarProps> = ({ navigation }) => {
  const location = useLocation();

  console.log('this is the current location', location);
  return (
    <div className='flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
      <nav className='flex flex-1 flex-col'>
        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
          <li>
            <ul role='list' className='-mx-2 space-y-1'>
              {navigation.map((item) => (
                <li key={item.name}>
                  {!item.children ? (
                    <a
                      href={item.href}
                      className={classNames(
                        item.href == location.pathname ? 'bg-gray-50' : 'hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700'
                      )}
                    >
                      {item.icon && (
                        <item.icon className='h-6 w-6 shrink-0 text-gray-400' aria-hidden='true' />
                      )}
                      {item.name}
                    </a>
                  ) : (
                    <Disclosure as='div'>
                      {({ open }) => (
                        <>
                          <DisclosureButton
                            className={classNames(
                              item.href == location.pathname ? 'bg-gray-50' : 'hover:bg-gray-50',
                              'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700'
                            )}
                          >
                            {item.icon && (
                              <item.icon
                                className='h-6 w-6 shrink-0 text-gray-400'
                                aria-hidden='true'
                              />
                            )}
                            {item.name}
                            <ChevronRightIcon
                              className={classNames(
                                open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                                'ml-auto h-5 w-5 shrink-0'
                              )}
                              aria-hidden='true'
                            />
                          </DisclosureButton>
                          <DisclosurePanel as='ul' className='mt-1 px-2'>
                            {item.children &&
                              item.children.map((subItem) => (
                                <li key={subItem.name}>
                                  {/* 44px */}
                                  <DisclosureButton
                                    as='a'
                                    href={subItem.href}
                                    className={classNames(
                                      subItem.href == location.pathname
                                        ? 'bg-gray-50'
                                        : 'hover:bg-gray-50',
                                      'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700'
                                    )}
                                  >
                                    {subItem.name}
                                  </DisclosureButton>
                                </li>
                              ))}
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
                  )}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
