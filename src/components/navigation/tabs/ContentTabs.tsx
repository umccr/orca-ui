import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { FC, ReactNode, useState, useEffect } from 'react';
import { useQueryParams } from '@/hooks/useQueryParams';

interface TabItemProps {
  label: string;
  content: ReactNode;
}
export interface TabsProps {
  tabs: TabItemProps[];
  withQueryParams?: boolean;
  tabQueryParam?: 'tab' | 'sideDrawerTab' | 'modalTab' | 'drawerTab' | 'tableTab';
}

export const Tabs: FC<TabsProps> = ({ tabs, withQueryParams = true, tabQueryParam = 'tab' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onChangeTabs = (index: number) => {
    setSelectedIndex(index);
    if (withQueryParams) {
      setQueryParams({ [tabQueryParam]: tabs[index].label });
    }
  };

  const { setQueryParams, queryParams } = useQueryParams();

  useEffect(() => {
    if (withQueryParams) {
      const tab = queryParams.get(tabQueryParam);
      const index = tabs.findIndex((t) => t.label === tab);
      if (index !== -1) {
        setSelectedIndex(index);
      } else {
        setSelectedIndex(0);
      }
    }
  }, [queryParams, tabs, withQueryParams, tabQueryParam]);

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
          defaultValue={tabs[selectedIndex].label}
          className='block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
        >
          {tabs.map((tab, index) => (
            <option key={index}>{tab.label}</option>
          ))}
        </select>
      </div>
      <div className='hidden sm:block w-full h-full justify-center pt-4 px-4'>
        <TabGroup selectedIndex={selectedIndex} onChange={onChangeTabs}>
          <TabList className='flex'>
            {tabs.map(({ label }, index) => (
              <Tab
                key={index}
                className='min-w-24 rounded-sm  py-1 px-3 text-sm font-semibold text-black hover:bg-gray-25 focus:z-10  data-[selected]:bg-magpie-light-50 data-[hover]:bg-magpie-light-50 data-[selected]:data-[hover]:bg-magpie-light-75  data-[selected]:outline-0 data-[selected]:border-b-[2px] data-[selected]:border-b-regal-blue'
              >
                {label}
              </Tab>
            ))}
          </TabList>
          <TabPanels className='mt-3'>
            {tabs.map(({ content }, index) => (
              <TabPanel key={index} className='rounded-xl p-2'>
                {content}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};
