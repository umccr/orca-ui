import {
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { classNames, getUsername } from '@/utils/utils';
import { useUserContext } from '@/context/UserContext';
import { signOut } from 'aws-amplify/auth';

export interface HeaderProps {}

const Header = () => {
  const userInformation = useUserContext().user;
  const userName = userInformation?.name || getUsername(userInformation?.email as string);

  return (
    <Disclosure as='nav' className='bg-heritage-blue-100 shadow'>
      {({ open }) => (
        <>
          <div className='mx-auto max-w-8xl sm:px-4 lg:divide-y lg:divide-gray-700 lg:px-8'>
            <div className='flex h-12 justify-between'>
              <div className='flex px-2 lg:px-0'>
                <div className='flex flex-shrink-0 items-center'>
                  <div className='text-xl text-white'>UMCCR</div>
                </div>
                <div className='hidden lg:ml-6 lg:flex lg:space-x-8'>
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  {/* <a
                    href='#'
                    className='inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900'
                  >
                    Dashboard
                  </a>
                  <a
                    href='#'
                    className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  >
                    Team
                  </a>
                  <a
                    href='#'
                    className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  >
                    Projects
                  </a>
                  <a
                    href='#'
                    className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  >
                    Calendar
                  </a> */}
                </div>
              </div>
              {/* <div className='flex flex-1 items-center justify-center px-2 lg:ml-6'>
                <div className='w-full max-w-lg lg:max-w-xs'>
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
                      className='block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                      placeholder='Search'
                      type='search'
                    />
                  </div>
                </div>
              </div> */}
              {/* mobile mode */}
              <div className='flex items-center lg:hidden'>
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
              {/*  */}
              <div className='hidden lg:ml-4 lg:flex lg:items-center'>
                <button
                  type='button'
                  className='relative flex-shrink-0 rounded-full bg-heritage-blue-100 p-1 text-white hover:text-gray-500 focus:outline-none '
                >
                  <span className='absolute -inset-1.5' />
                  <span className='sr-only'>View notifications</span>
                  <BellIcon className='h-6 w-6' aria-hidden='true' />
                </button>

                {/* Profile dropdown */}
                <Menu as='div' className='relative ml-4 flex-shrink-0'>
                  <div>
                    <MenuButton className='relative flex rounded-full bg-heritage-blue-100 p-1 text-white hover:text-gray-500 focus:outline-none'>
                      <span className='absolute -inset-1.5' />
                      <span className='sr-only'>Open user menu</span>
                      {userName}
                    </MenuButton>
                  </div>

                  <MenuItems className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <MenuItem>
                      {({ disabled }) => (
                        <button
                          className={classNames(
                            disabled ? 'bg-gray-100' : '',
                            'block w-full text-left px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900'
                          )}
                          onClick={() => console.log('Token')}
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
                          onClick={() => signOut()}
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

          <DisclosurePanel className='lg:hidden'>
            <div className='space-y-1 pb-3 pt-2'>
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" */}
              {/* <DisclosureButton
                as='a'
                href='#'
                className='block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700'
              >
                Dashboard
              </DisclosureButton>
              <DisclosureButton
                as='a'
                href='#'
                className='block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
              >
                Team
              </DisclosureButton>
              <DisclosureButton
                as='a'
                href='#'
                className='block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
              >
                Projects
              </DisclosureButton>
              <DisclosureButton
                as='a'
                href='#'
                className='block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
              >
                Calendar
              </DisclosureButton> */}
            </div>
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
                  as='button'
                  className='block w-full text-left px-4 py-2 text-base font-medium text-white hover:bg-gray-100 hover:text-gray-800'
                >
                  Token
                </DisclosureButton>
                <DisclosureButton
                  as='button'
                  className='block w-full text-left px-4 py-2 text-base font-medium text-white hover:bg-gray-100 hover:text-gray-800'
                  onClick={() => signOut()}
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
