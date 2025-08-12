import { ReactNode, Suspense } from 'react';

import { SpinnerWithText } from '@/components/common/spinner';
import { DetailedErrorBoundary } from '@/components/common/error';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/common/sidebar';

type Props = {
  children: ReactNode;
  sideBar?: ReactNode;
  iconOnClosed?: ReactNode;
  iconOnOpen?: ReactNode;
};

const SideBarLayout = ({ children, sideBar, iconOnClosed, iconOnOpen }: Props) => {
  return (
    <DetailedErrorBoundary errorTitle='Unable to load page'>
      <Suspense fallback={<SpinnerWithText text='Loading page ...' />}>
        <div className='flex h-full w-full flex-row'>
          <div className='mt-4 flex-grow overflow-auto pr-8'>{children || <Outlet />} </div>
          {sideBar && (
            <div className='flex'>
              <Sidebar
                position='right'
                preferenceStorageKey='vault-filter-sidebar'
                openWidth='w-max'
                iconOnClosed={iconOnClosed}
                iconOnOpen={iconOnOpen}
              >
                {sideBar}
              </Sidebar>
            </div>
          )}
        </div>
      </Suspense>
    </DetailedErrorBoundary>
  );
};

export default SideBarLayout;
