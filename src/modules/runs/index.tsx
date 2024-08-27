import { lazy } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { RouteObject } from '@/types/routeObject';
import { AppURLs } from '@/utils/appURLs';
import RunsModuleLayout from '@/components/layouts/RunsModuleLayout';

const SequenceRunPage = lazy(() => import('@/modules/runs/Pages/SequenceRuns'));
const LibraryRunPage = lazy(() => import('@/modules/runs/Pages/LibraryRuns'));
const WorkflowRunPage = lazy(() => import('@/modules/runs/Pages/WorkflowRuns'));
const SequenceRunDetailsPage = lazy(() => import('@/modules/runs/Pages/SequenceRunsDetails'));

export const Router: RouteObject = {
  path: AppURLs.Runs,
  element: (
    <RunsModuleLayout>
      <Outlet />
    </RunsModuleLayout>
  ),
  children: [
    { path: AppURLs.Runs, element: <Navigate to='sequence' replace /> },
    { path: AppURLs.RunsSequence, title: 'Runs - Sequence Run', element: <SequenceRunPage /> },
    { path: AppURLs.RunsLibrary, title: 'Runs - Library Run', element: <LibraryRunPage /> },
    { path: AppURLs.RunsWorkflow, title: 'Runs - Workflow Run', element: <WorkflowRunPage /> },
    {
      path: AppURLs.RunsSequenceDeatils,
      title: 'Runs - Sequence Run Details',
      element: <SequenceRunDetailsPage />,
    },
  ],
};
