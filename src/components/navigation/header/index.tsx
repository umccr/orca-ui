import { useState } from 'react';
import {
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  MenuSeparator,
} from '@headlessui/react';
//import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon, BellIcon } from '@heroicons/react/24/outline';
import { classNames, getUsername } from '@/utils/commonUtils';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import { TokenDialog } from './TokenDialog';
import { DetailedErrorBoundary } from '@/components/common/error';
import { Link } from 'react-router-dom';

export interface HeaderProps {}

const Header = () => {
  const { user: userInformation, logout } = useAuthContext();
  const userName = userInformation?.name || getUsername(userInformation?.email as string);

  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState<boolean>(false);
  const openTokenDialogOpen = () => setIsTokenDialogOpen(true);

  return (
    <Disclosure as='nav' className='bg-heritage-blue-100 shadow py-0.5 '>
      {({ open }) => (
        <>
          {isTokenDialogOpen && (
            <DetailedErrorBoundary errorTitle='Unable fetch fresh JWT'>
              <TokenDialog onClose={() => setIsTokenDialogOpen(false)} />
            </DetailedErrorBoundary>
          )}
          <div className='mx-auto max-w-8xl sm:px-4 md:divide-y md:divide-gray-700 md:px-8'>
            <div className='flex h-10 justify-between'>
              <div className='flex px-2 md:px-0'>
                <div className='flex flex-shrink-0 items-center'>
                  <Link to='/'>
                    <div className='text-xl text-white'>UMCCR</div>
                  </Link>
                </div>
              </div>

              {/* hide global search globally */}
              {/* <div className='hidden px-2 md:flex md:flex-1 items-center justify-center md:ml-6'>
                <div className='w-full max-w-lg md:max-w-xs'>
                  <label htmlFor='search' className='sr-only'>
                    Search
                  </label>
                  <div className='relative'>
                    <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                      <MagnifyingGlassIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                    </div>
                    <input
                      id='search'
                      name='search'
                      className='block w-full rounded-md border-0 bg-white py-1 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      placeholder='Search'
                      type='search'
                    />
                  </div>
                </div>
              </div> */}

              {/* mobile mode */}

              <div className='flex items-center md:hidden'>
                {/* <div className='flex flex-1 items-center justify-center px-10'>
                  <div className='w-full max-w-lg md:max-w-xs'>
                    <label htmlFor='search' className='sr-only'>
                      Search
                    </label>
                    <div className='relative'>
                      <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                        <MagnifyingGlassIcon className='h-5 w-5 text-white' aria-hidden='true' />
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* Mobile menu button */}
                <DisclosureButton className='relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                  <span className='absolute -inset-0.5' />
                  <span className='sr-only'>Open main menu</span>
                  {open ? (
                    <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                  ) : (
                    <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                  )}
                </DisclosureButton>
              </div>
              {/* Notification */}
              <div className='hidden md:ml-4 md:flex md:items-center'>
                {/* <button
                  type='button'
                  className='relative flex-shrink-0 rounded-full bg-heritage-blue-100 p-1 text-white hover:text-gray-500 focus:outline-none '
                >
                  <span className='absolute -inset-1.5' />
                  <span className='sr-only'>View notifications</span>
                  <BellIcon className='h-6 w-6' aria-hidden='true' />
                </button> */}

                {/* Profile dropdown */}
                <Menu as='div' className='relative ml-4 flex-shrink-0'>
                  <div>
                    <MenuButton className='relative flex rounded-full bg-heritage-blue-100 p-1 text-white text-base hover:text-gray-500 focus:outline-none'>
                      <span className='absolute -inset-1.5' />
                      <span className='sr-only'>Open user menu</span>
                      {userName}
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
                  >
                    <MenuItem>
                      <div className='px-4 py-2'>
                        <div className='text-sm text-gray-500'>Signed in as</div>
                        <div className='text-sm text-black font-bold'>{userInformation.email}</div>
                      </div>
                    </MenuItem>
                    <MenuSeparator className='my-1 h-px bg-gray-200' />

                    <MenuItem>
                      {({ disabled }) => (
                        <button
                          className={classNames(
                            disabled ? 'bg-gray-100' : '',
                            'block w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
                          )}
                          onClick={openTokenDialogOpen}
                        >
                          Token
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ disabled }) => (
                        <button
                          className={classNames(
                            disabled ? 'bg-gray-100' : '',
                            'block w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
                          )}
                          onClick={logout}
                        >
                          Sign out
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <DisclosurePanel className='md:hidden'>
            <div className='border-t border-gray-200 pb-3 pt-4'>
              <div className='flex items-center px-4'>
                <div className='ml-3'>
                  <div className='text-base font-medium text-white'>{userName}</div>
                  <div className='text-sm font-medium text-white'>{userInformation.email}</div>
                </div>
                <button
                  type='button'
                  className='relative ml-auto flex-shrink-0 rounded-full bg-heritage-blue-75 p-1 text-white hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                >
                  <span className='absolute -inset-1.5' />
                  <span className='sr-only'>View notifications</span>
                  <BellIcon className='h-6 w-6' aria-hidden='true' />
                </button>
              </div>
              <div className='mx-3 mt-3 space-y-1'>
                <DisclosureButton
                  onClick={openTokenDialogOpen}
                  as='button'
                  className='rounded-lg block w-full text-left px-4 py-2 text-base font-medium text-white hover:bg-gray-100 hover:text-gray-800'
                >
                  Token
                </DisclosureButton>
                <DisclosureButton
                  as='button'
                  className='rounded-lg block w-full text-left px-4 py-2 text-base font-medium text-white hover:bg-gray-100 hover:text-gray-800'
                  onClick={logout}
                >
                  Sign out
                </DisclosureButton>
              </div>
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
