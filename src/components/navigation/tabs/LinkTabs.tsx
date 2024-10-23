import { classNames } from '@/utils/commonUtils';
import { FC } from 'react';
import { Link } from 'react-router-dom';

interface LinkTabsProps {
  tabs: {
    name: string;
    href: string;
    current: boolean;
  }[];
}

export const LinkTabs: FC<LinkTabsProps> = ({ tabs }) => {
  return (
    <div>
      <div className='sm:hidden'>
        <label htmlFor='tabs' className='sr-only'>
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id='tabs'
          name='tabs'
          defaultValue={tabs.find((tab) => tab.current)?.name}
          className='block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-gray-300'
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className='hidden sm:block'>
        <div className='border-b border-gray-200'>
          <nav aria-label='Tabs' className='-mb-px flex space-x-8'>
            {tabs.map((tab, tabIdx) => (
              <Link
                key={tabIdx}
                to={tab.href}
                aria-current={tab.current ? 'page' : undefined}
                className={classNames(
                  tab.current
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                  'flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium'
                )}
              >
                <span>{tab.name}</span>
                <span
                  aria-hidden='true'
                  className={classNames(
                    tab.current ? 'bg-indigo-500' : 'bg-transparent',
                    'absolute inset-x-0 bottom-0 h-0.5'
                  )}
                />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
