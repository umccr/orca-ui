import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import RunsPageLayout from '@/components/layouts/runs/RunsPageLayout';
import { RouteObject } from 'react-router-dom';

const SequenceRunPage = lazy(() => import('@/modules/runs/pages/SequenceRuns'));
const WorkflowRunPage = lazy(() => import('@/modules/runs/pages/WorkflowRuns'));
const WorkflowRunDetailsPage = lazy(() => import('@/modules/runs/pages/WorkflowRunsDetails'));
const AnalysisRunPage = lazy(() => import('@/modules/runs/pages/AnalysisRuns'));
const AnalysisRunDetailsPage = lazy(() => import('@/modules/runs/pages/AnalysisRunsDetails'));
const RunsPage = lazy(() => import('@/modules/runs/pages/RunsPage'));
const WorkflowRunsReport = lazy(() => import('@/modules/runs/pages/WorkflowRunsReport'));

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
            { path: 'report', element: <WorkflowRunsReport /> },
          ],
        },
      ],
    },
  ],
};
