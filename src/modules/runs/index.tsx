// import RunsModuleLayout from '@/components/layouts/runs/RunsModuleLayout';
import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// import { RouteObject } from '@/types/routeObject';
// import { AppURLs } from '@/utils/appURLs';
// import RunsModuleLayout from '@/components/layouts/runs/RunsModuleLayout';
import RunsPageLayout from '@/components/layouts/runs/RunsPageLayout';
import { RouteObject } from 'react-router-dom';

// const SequenceRunPage = lazy(() => import('@/modules/runs/pages/SequenceRuns'));
const LibraryRunPage = lazy(() => import('@/modules/runs/Pages/LibraryRuns'));
// const WorkflowRunPage = lazy(() => import('@/modules/runs/pages/WorkflowRuns'));
const SequenceRunDetailsPage = lazy(() => import('@/modules/runs/Pages/SequenceRunDetails'));
// const DevelopmentPage = lazy(() => import('@/modules/error/DevelopmentPage'));
const SequenceRunPage = lazy(() => import('@/modules/runs/Pages/SequenceRuns'));
const WorkflowRunPage = lazy(() => import('@/modules/runs/Pages/WorkflowRuns'));
const WorkflowRunDetailsPage = lazy(() => import('@/modules/runs/Pages/WorkflowRunDetails'));
const RunsPage = lazy(() => import('@/modules/runs/Pages/RunsPage'));

export const Router: RouteObject = {
  path: 'runs',
  element: (
    <RunsPageLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </RunsPageLayout>
  ),
  children: [
    { path: '', element: <RunsPage /> },
    { path: 'sequence', element: <SequenceRunPage /> },
    { path: 'library', element: <LibraryRunPage /> },
    { path: 'workflow', element: <WorkflowRunPage /> },

    {
      path: 'sequence/:id',
      element: <SequenceRunDetailsPage />,
    },
    {
      path: 'workflow/:orcabusId',
      element: <WorkflowRunDetailsPage />,
    },
  ],
};
