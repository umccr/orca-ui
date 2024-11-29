import { classNames } from '@/utils/commonUtils';
import { FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LinkTabsProps {
  className?: string;
  tabs: {
    name: string;
    href: string;
    current: boolean;
  }[];
}

export const LinkTabs: FC<LinkTabsProps> = ({ tabs, className }) => {
  const navigate = useNavigate();
  return (
    <div className={className}>
      <div className='sm:hidden'>
        <label htmlFor='tabs' className='sr-only'>
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id='tabs'
          name='tabs'
          defaultValue={tabs.find((tab) => tab.current)?.name}
          className='block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-gray-300'
          onChange={(e) => {
            navigate(e.target.value);
          }}
        >
          {tabs.map((tab) => (
            <option key={tab.name} value={tab.href}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className='hidden sm:block'>
        <div className='border-b border-gray-200 flex flex-row'>
          <nav aria-label='Tabs' className='-mb-px flex space-x-8'>
            {tabs.map((tab, tabIdx) => (
              <Link
                key={tabIdx}
                to={tab.href}
                aria-current={tab.current ? 'page' : undefined}
                className={classNames(
                  tab.current
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700',
                  'flex whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium'
                )}
              >
                <span>{tab.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
