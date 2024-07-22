import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Link, useLocation } from 'react-router-dom';
import { classNames } from '@/utils/utils';
import { FC } from 'react';

export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  children?: NavigationItem[];
}

export interface NavbarProps {
  navigation: NavigationItem[];
}

const Navbar: FC<NavbarProps> = ({ navigation }) => {
  const location = useLocation();

  return (
    <div className='flex grow-0 flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6'>
      <nav className='flex flex-1 flex-col'>
        <ul role='list' className='flex flex-1 flex-col gap-y-7'>
          <li>
            <ul role='list' className='-mx-2 space-y-1'>
              {navigation.map((item) => (
                <li key={item.name}>
                  {!item.children ? (
                    <Link
                      to={item.href}
                      className={classNames(
                        item.href == location.pathname ? 'bg-gray-50' : 'hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700'
                      )}
                    >
                      {item.icon && (
                        <item.icon className='h-5 w-5 shrink-0 text-gray-400' aria-hidden='true' />
                      )}
                      {item.name}
                    </Link>
                  ) : (
                    // <Disclosure as='div'>
                    //   {({ open }) => (
                    //     <>
                    //       <DisclosureButton
                    //         className={classNames(
                    //           item.href == location.pathname ? 'bg-gray-50' : 'hover:bg-gray-50',
                    //           'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold text-gray-700'
                    //         )}
                    //       >
                    //         {item.icon && (
                    //           <item.icon
                    //             className='h-5 w-5 shrink-0 text-gray-400'
                    //             aria-hidden='true'
                    //           />
                    //         )}
                    //         {item.name}
                    //         <ChevronRightIcon
                    //           className={classNames(
                    //             open ? 'rotate-90 text-gray-500' : 'text-gray-400',
                    //             'ml-auto h-5 w-5 shrink-0'
                    //           )}
                    //           aria-hidden='true'
                    //         />
                    //       </DisclosureButton>
                    //       <DisclosurePanel as='ul' className='mt-1 px-2'>
                    //         {item.children &&
                    //           item.children.map((subItem) => (
                    //             <li key={subItem.name}>
                    //               {/* 44px */}
                    //               <DisclosureButton
                    //                 as='a'
                    //                 href={subItem.href}
                    //                 className={classNames(
                    //                   subItem.href == location.pathname
                    //                     ? 'bg-gray-50'
                    //                     : 'hover:bg-gray-50',
                    //                   'block rounded-md py-2 pr-2 pl-9 text-sm leading-6 text-gray-700'
                    //                 )}
                    //               >
                    //                 {subItem.name}
                    //               </DisclosureButton>
                    //             </li>
                    //           ))}
                    //       </DisclosurePanel>
                    //     </>
                    //   )}
                    // </Disclosure>
                    <Disclosure
                      as='div'
                      defaultOpen={item.href ? location.pathname.includes(item.href) : false}
                    >
                      <DisclosureButton
                        className={classNames(
                          item.href == location.pathname ? 'bg-gray-50' : 'hover:bg-gray-50',
                          'group flex w-full items-center gap-x-3 rounded-md p-2 text-left text-sm font-semibold leading-6 text-gray-700'
                        )}
                      >
                        {item.icon && (
                          <item.icon
                            aria-hidden='true'
                            className='h-6 w-6 shrink-0 text-gray-400'
                          />
                        )}
                        {item.name}
                        <ChevronRightIcon
                          aria-hidden='true'
                          className='ml-auto h-5 w-5 shrink-0 text-gray-400 group-data-[open]:rotate-90 group-data-[open]:text-gray-500'
                        />
                      </DisclosureButton>
                      <DisclosurePanel as='ul' className='mt-1 px-2'>
                        {item.children.map((subItem) => (
                          <li key={subItem.name}>
                            {/* 44px */}
                            <DisclosureButton
                              as='a'
                              href={subItem.href}
                              className={classNames(
                                subItem.href == location.pathname
                                  ? 'bg-gray-50'
                                  : 'hover:bg-gray-50',
                                'block rounded-md py-2 pl-9 pr-2 text-sm leading-6 text-gray-700'
                              )}
                            >
                              {subItem.name}
                            </DisclosureButton>
                          </li>
                        ))}
                      </DisclosurePanel>
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