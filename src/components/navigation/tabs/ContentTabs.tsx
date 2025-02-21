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
  className?: string;
}

export const Tabs: FC<TabsProps> = ({ tabs, selectedLabel = tabs[0]?.label ?? '', className }) => {
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
    'border-blue-500 text-blue-500 rounded-t-lg active dark:text-blue-500 focus:outline-none';
  const regularClassName =
    'border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300';

  return (
    <div className={classNames(className)}>
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
          className='block rounded-md border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400'
        >
          {tabs.map((tab, index) => (
            <option key={index}>{tab.label}</option>
          ))}
        </select>
      </div>

      {/* Desktop tab selector */}
      <div className='hidden sm:block'>
        <TabGroup selectedIndex={selectedTabIndex} onChange={onChangeTabs}>
          <TabList className='flex border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400'>
            {tabs.map(({ label }, index) => (
              <Tab
                as='div'
                key={index}
                className={classNames(
                  selectedTabIndex === index ? selectedClassName : regularClassName,
                  'inline-block cursor-pointer border-b-2 p-4'
                )}
              >
                {label}
              </Tab>
            ))}
          </TabList>
          <TabPanels className='mt-3'>
            {tabs.map(({ content }, index) => (
              <TabPanel key={index} className='mt-2 rounded-xl'>
                {content}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};
