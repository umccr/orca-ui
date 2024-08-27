import { lazy } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
// import { RouteObject } from '@/types/routeObject';
// import { AppURLs } from '@/utils/appURLs';
import RunsModuleLayout from '@/components/layouts/RunsModuleLayout';
import { RouteObject } from 'react-router-dom';

const SequenceRunPage = lazy(() => import('@/modules/runs/Pages/SequenceRuns'));
const LibraryRunPage = lazy(() => import('@/modules/runs/Pages/LibraryRuns'));
const WorkflowRunPage = lazy(() => import('@/modules/runs/Pages/WorkflowRuns'));
const SequenceRunDetailsPage = lazy(() => import('@/modules/runs/Pages/SequenceRunsDetails'));

export const Router: RouteObject = {
  path: 'runs',
  element: (
    <RunsModuleLayout>
      <Outlet />
    </RunsModuleLayout>
  ),
  children: [
    { path: '', element: <Navigate to='sequence' replace /> },
    { path: 'sequence', element: <SequenceRunPage /> },
    { path: 'library', element: <LibraryRunPage /> },
    { path: 'workflow', element: <WorkflowRunPage /> },
    {
      path: 'sequence/:id',
      element: <SequenceRunDetailsPage />,
    },
  ],
};
