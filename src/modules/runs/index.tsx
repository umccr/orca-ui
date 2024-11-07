import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// import { RouteObject } from '@/types/routeObject';
// import { AppURLs } from '@/utils/appURLs';
import RunsPageLayout from '@/components/layouts/runs/RunsPageLayout';
import { RouteObject } from 'react-router-dom';

const SequenceRunPage = lazy(() => import('@/modules/runs/Pages/SequenceRuns'));
const WorkflowRunPage = lazy(() => import('@/modules/runs/Pages/WorkflowRuns'));
const WorkflowRunDetailsPage = lazy(() => import('@/modules/runs/Pages/WorkflowRunsDetails'));
const AnalysisRunPage = lazy(() => import('@/modules/runs/Pages/AnalysisRuns'));
const AnalysisRunDetailsPage = lazy(() => import('@/modules/runs/Pages/AnalysisRunsDetails'));
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
    {
      path: '',
      element: <RunsPage />,
      children: [
        { path: '', element: <Navigate to='sequence' replace /> },
        {
          path: 'sequence',
          children: [{ path: '', element: <SequenceRunPage /> }],
        },
        {
          path: 'analysis',
          children: [
            { path: '', element: <AnalysisRunPage /> },
            { path: ':orcabusId', element: <AnalysisRunDetailsPage /> },
            { path: ':analysis_orcabusId/:orcabusId', element: <WorkflowRunDetailsPage /> },
          ],
        },
        {
          path: 'workflow',
          children: [
            { path: '', element: <WorkflowRunPage /> },
            { path: ':orcabusId', element: <WorkflowRunDetailsPage /> },
          ],
        },
      ],
    },
  ],
};
