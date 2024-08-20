import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import { FC, ReactNode } from 'react';

interface TabItemProps {
  label: string;
  content: ReactNode;
}
export interface TabsProps {
  tabs: TabItemProps[];
}

export const Tabs: FC<TabsProps> = ({ tabs }) => {
  return (
    <div className='flex h-screen w-full justify-center pt-24 px-4 '>
      <div className='w-full max-w-md'>
        <TabGroup>
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
              <TabPanel key={index} className='rounded-xl bg-white p-3'>
                {content}
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};
