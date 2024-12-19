import { useState } from 'react';
import {
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  // MenuSeparator,
} from '@headlessui/react';
//import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
  Bars3Icon,
  XMarkIcon,
  // BellIcon,
  UserCircleIcon,
  KeyIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { getUsername } from '@/utils/commonUtils';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import { TokenDialog } from './TokenDialog';
import { DetailedErrorBoundary } from '@/components/common/error';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header = ({ className }: { className?: string }) => {
  const { user: userInformation, logout } = useAuthContext(); // Add theme contex
  const userName = userInformation?.name || getUsername(userInformation?.email as string);

  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState<boolean>(false);
  const openTokenDialogOpen = () => setIsTokenDialogOpen(true);

  return (
    <Disclosure as='nav' className={`z-10 w-full bg-heritage-blue-100 shadow ${className ?? ''}`}>
      {({ open }) => (
        <>
          {isTokenDialogOpen && (
            <DetailedErrorBoundary errorTitle='Unable fetch fresh JWT'>
              <TokenDialog onClose={() => setIsTokenDialogOpen(false)} />
            </DetailedErrorBoundary>
          )}
          <div className='max-w-8xl mx-auto sm:px-4 md:divide-y md:divide-gray-700 md:px-8'>
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
                  <span className='absolute' />
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
                <ThemeToggle />
                {/* divider */}
                <hr className='mx-2 h-6 w-px border-none bg-slate-200 dark:bg-slate-700' />

                {/* Profile dropdown */}
                <Menu as='div' className='relative ml-4 flex-shrink-0'>
                  <div>
                    <MenuButton className='bg-heritage-blue-200/20 hover:bg-heritage-blue-200/30 relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 dark:bg-gray-700 dark:hover:bg-gray-600'>
                      <UserCircleIcon className='h-5 w-5' aria-hidden='true' />
                      <span>{userName}</span>
                    </MenuButton>
                  </div>

                  <MenuItems
                    transition
                    anchor='bottom end'
                    className='right-0 z-10 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black/5 transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0 dark:divide-gray-700 dark:bg-gray-800 dark:ring-white/10'
                  >
                    <div className='px-4 py-3'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900'>
                          <span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                            {userInformation?.email?.[0].toUpperCase() || '?'}
                          </span>
                        </div>
                        <div>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>Signed in as</p>
                          <p className='truncate text-sm font-medium text-gray-900 dark:text-white'>
                            {userInformation.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col py-1'>
                      <MenuItem as='button' onClick={openTokenDialogOpen}>
                        <span className='flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors data-[focus]:bg-gray-50 data-[focus]:text-gray-900 dark:text-gray-200 dark:data-[focus]:bg-gray-700/50 dark:data-[focus]:text-white'>
                          <KeyIcon className='mr-2 h-5 w-5' />
                          Get Token
                        </span>
                      </MenuItem>
                      <MenuItem as='button' onClick={logout}>
                        <span className='flex w-full items-center px-4 py-2 text-sm text-red-500 transition-colors data-[focus]:bg-gray-50 data-[focus]:text-red-600 dark:text-red-400 dark:data-[focus]:bg-gray-700/50 dark:data-[focus]:text-red-400'>
                          <ArrowRightStartOnRectangleIcon className='mr-2 h-5 w-5' />
                          Sign out
                        </span>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          <DisclosurePanel className='md:hidden'>
            <div className='border-t border-gray-200/20 pb-3 pt-4'>
              <div className='flex items-center justify-between px-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900'>
                    <span className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                      {userInformation?.email?.[0].toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <p className='text-sm text-gray-300'>Signed in as</p>
                    <p className='truncate text-sm font-medium text-white'>
                      {userInformation.email}
                    </p>
                  </div>
                </div>
                <ThemeToggle />
              </div>
              <div className='mx-3 mt-3 space-y-1'>
                <DisclosureButton
                  onClick={openTokenDialogOpen}
                  as='button'
                  className='hover:bg-heritage-blue-200/30 flex w-full items-center rounded-lg px-4 py-2 text-sm text-white'
                >
                  <KeyIcon className='mr-2 h-5 w-5' />
                  Get Token
                </DisclosureButton>
                <DisclosureButton
                  as='button'
                  className='hover:bg-heritage-blue-200/30 flex w-full items-center rounded-lg px-4 py-2 text-sm text-red-400'
                  onClick={logout}
                >
                  <ArrowRightStartOnRectangleIcon className='mr-2 h-5 w-5' />
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
