import { FC, ReactNode } from 'react';
import { classNames } from '@/utils/commonUtils';

export interface SidebarLayoutProps {
  main: ReactNode;
  sideBar: ReactNode;
  sideBarPosition: 'left' | 'right';
  mainClassName?: string;
  containerClassName?: string;
  sideBarClassName?: string;
}

const SidebarLayout: FC<SidebarLayoutProps> = ({
  main,
  sideBar,
  sideBarPosition,
  mainClassName,
  containerClassName,
  sideBarClassName,
}) => {
  return (
    <div className={classNames('flex h-full w-full', 'overflow-hidden', containerClassName)}>
      {sideBarPosition === 'left' && (
        <div className={classNames('h-full flex-shrink-0', sideBarClassName)}>{sideBar}</div>
      )}

      <main className={classNames('min-w-0 flex-1', 'h-full overflow-auto', 'px-4', mainClassName)}>
        {main}
      </main>

      {sideBarPosition === 'right' && (
        <div className={classNames('h-full flex-shrink-0', sideBarClassName)}>{sideBar}</div>
      )}
    </div>
  );
};

export default SidebarLayout;
