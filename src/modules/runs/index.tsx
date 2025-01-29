/* eslint-disable react-refresh/only-export-components */
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347

import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import RunsModuleLayout from '@/components/layouts/runs/RunsModuleLayout';
import { RouteObject } from 'react-router-dom';

const SequenceRunPage = lazy(() => import('@/modules/runs/pages/SequenceRuns'));
const WorkflowRunPage = lazy(() => import('@/modules/runs/pages/WorkflowRuns'));
const WorkflowRunDetailsPage = lazy(() => import('@/modules/runs/pages/WorkflowRunsDetails'));
const AnalysisRunPage = lazy(() => import('@/modules/runs/pages/AnalysisRuns'));
const AnalysisRunDetailsPage = lazy(() => import('@/modules/runs/pages/AnalysisRunsDetails'));
// const RunsPage = lazy(() => import('@/modules/runs/pages/RunsPage'));

export const Router: RouteObject = {
  path: 'runs',
  element: (
    <RunsModuleLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </RunsModuleLayout>
  ),
  children: [
    {
      path: '',
      // element: <RunsPage />,
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
