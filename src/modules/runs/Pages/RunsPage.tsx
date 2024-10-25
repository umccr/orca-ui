import { Suspense } from 'react';
import { LinkTabs } from '@/components/navigation/tabs/LinkTabs';
import { Outlet, useLocation } from 'react-router-dom';

const RunsPage = () => {
  const fullPath = useLocation().pathname;
  const tabs = [
    { name: 'Sequence', href: '/runs/sequence', current: fullPath.includes('/runs/sequence') },
    { name: 'Analysis', href: '/runs/analysis', current: fullPath.includes('/runs/analysis') },
    // { name: 'Library', href: '/runs/library', current: fullPath.includes('/runs/library') },
    { name: 'Workflow', href: '/runs/workflow', current: fullPath.includes('/runs/workflow') },
  ];
  return (
    <>
      <LinkTabs tabs={tabs} />
      <div className='pt-4'></div>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </>
  );
};

export default RunsPage;
