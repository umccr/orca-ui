import { FC, ReactNode } from 'react';

export interface SidebarProps {
  main: ReactNode;
  sideBar: ReactNode;
  sideBarPosition: 'left' | 'right';
}

const SidebarLayout: FC<SidebarProps> = ({ main, sideBar, sideBarPosition }) => {
  return (
    <div className='flex h-full flex-row'>
      {sideBarPosition === 'left' && <div className='flex h-full'>{sideBar}</div>}
      <div className='w-full'>{main}</div>
      {sideBarPosition === 'right' && <div className='flex h-full'>{sideBar}</div>}
    </div>
  );
};

export default SidebarLayout;
