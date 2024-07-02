import { Fragment } from 'react';
import { Transition, Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DropDownExample() {
  return (
    <Menu as='div' className='relative inline-block text-left'>
      <div>
        <MenuButton className='inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
          Options
          <ChevronDownIcon className='-mr-1 h-5 w-5 text-gray-400' aria-hidden='true' />
        </MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter='transition ease-out duration-100'
        enterFrom='transform opacity-0 scale-95'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-75'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-95'
      >
        <MenuItems className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='py-1'>
            <MenuItem>
              {({ disabled }) => (
                <a
                  href='#'
                  className={classNames(
                    disabled ? 'text-gray-700' : 'bg-gray-100 text-gray-900',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Account settings
                </a>
              )}
            </MenuItem>
            <MenuItem>
              {({ disabled }) => (
                <a
                  href='#'
                  className={classNames(
                    disabled ? 'text-gray-700' : 'bg-gray-100 text-gray-900',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Support
                </a>
              )}
            </MenuItem>
            <MenuItem>
              {({ disabled }) => (
                <a
                  href='#'
                  className={classNames(
                    disabled ? 'text-gray-700' : 'bg-gray-100 text-gray-900',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  License
                </a>
              )}
            </MenuItem>
            <form method='POST' action='#'>
              <MenuItem>
                {({ disabled }) => (
                  <button
                    type='submit'
                    className={classNames(
                      disabled ? 'text-gray-700' : 'bg-gray-100 text-gray-900',
                      'block w-full px-4 py-2 text-left text-sm'
                    )}
                  >
                    Sign out
                  </button>
                )}
              </MenuItem>
            </form>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}
