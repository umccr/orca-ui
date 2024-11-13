import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { FC, ReactNode, useState, useEffect } from 'react';
import { classNames } from '@/utils/commonUtils';
interface TabItemProps {
  label: string;
  content: ReactNode;
}
export interface TabsProps {
  tabs: TabItemProps[];
  selectedLabel?: string;
}

export const Tabs: FC<TabsProps> = ({ tabs, selectedLabel = tabs[0]?.label ?? '' }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(
    tabs.findIndex((tab) => tab.label === selectedLabel)
  );

  const onChangeTabs = (index: number) => {
    setSelectedTabIndex(index);
  };

  useEffect(() => {
    setSelectedTabIndex(tabs.findIndex((tab) => tab.label === selectedLabel));
  }, [selectedLabel, tabs]);

  const selectedClassName =
    'border-blue-500 text-blue-600 rounded-t-lg active dark:text-blue-500 focus:outline-none';
  const regularClassName =
    'border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300';

  return (
    <div>
      {/* Mobile tab selector */}
      <div className='sm:hidden'>
        <label htmlFor='tabs' className='sr-only'>
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id='tabs'
          name='tabs'
          defaultValue={selectedTabIndex}
          className='block rounded-md text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700'
        >
          {tabs.map((tab, index) => (
            <option key={index}>{tab.label}</option>
          ))}
        </select>
      </div>

      {/* Desktop tab selector */}
      <div className='hidden sm:block  '>
        <TabGroup selectedIndex={selectedTabIndex} onChange={onChangeTabs}>
          <TabList className='flex text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700'>
            {tabs.map(({ label }, index) => (
              <Tab
                as='div'
                key={index}
                className={classNames(
                  selectedTabIndex === index ? selectedClassName : regularClassName,
                  'cursor-pointer	inline-block p-4 border-b-2 '
                )}
              >
                {label}
              </Tab>
            ))}
          </TabList>
          <TabPanels className='mt-3'>
            {tabs.map(({ content }, index) => (
              <TabPanel key={index} className='rounded-xl mt-2'>
                {content}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};
