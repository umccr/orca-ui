import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { FC, ReactNode, useState } from 'react';
import { useQueryParams } from '@/hooks/useQueryParams';

interface TabItemProps {
  label: string;
  content: ReactNode;
}
export interface TabsProps {
  tabs: TabItemProps[];
}

export const Tabs: FC<TabsProps> = ({ tabs }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const onChangeParams = (queryParams: URLSearchParams) => {
    const tab = queryParams.get('tab');
    if (tab) {
      setSelectedIndex(tabs.findIndex((t) => t.label === tab));
    }
  };

  const onChangeTabs = (index: number) => {
    setSelectedIndex(index);
    setQueryParams({ tab: tabs[index].label });
  };

  const { setQueryParams } = useQueryParams(onChangeParams);

  return (
    <div className='flex h-full w-full justify-center pt-4 px-4 '>
      <div className='w-full'>
        <TabGroup selectedIndex={selectedIndex} onChange={onChangeTabs}>
          <TabList className='flex'>
            {tabs.map(({ label }, index) => (
              <Tab
                key={index}
                className='min-w-24 rounded-sm  py-1 px-3 text-sm font-semibold text-black hover:bg-gray-25 focus:z-10  data-[selected]:bg-magpie-light-75 data-[hover]:bg-magpie-light-50 data-[selected]:data-[hover]:bg-magpie-light-75  data-[selected]:outline-0 data-[selected]:border-b-[2px] data-[selected]:border-b-regal-blue'
              >
                {label}
              </Tab>
            ))}
          </TabList>
          <TabPanels className='mt-3'>
            {tabs.map(({ content }, index) => (
              <TabPanel key={index} className='rounded-xl p-3'>
                {content}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};
