import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import RunsModuleLayout from '@/components/layouts/runs/RunsModuleLayout';
import { RouteObject } from 'react-router-dom';
import { SpinnerWithText } from '@/components/common/spinner';
const SequenceRunPage = lazy(() => import('@/modules/runs/pages/SequenceRuns'));
const WorkflowRunPage = lazy(() => import('@/modules/runs/pages/WorkflowRuns'));
const WorkflowRunsDetailsPage = lazy(() => import('@/modules/runs/pages/WorkflowRunsDetails'));
const AnalysisRunPage = lazy(() => import('@/modules/runs/pages/AnalysisRuns'));
const AnalysisRunDetailsPage = lazy(() => import('@/modules/runs/pages/AnalysisRunsDetails'));
const SequenceRunDetailsPage = lazy(() => import('@/modules/runs/pages/SequenceRunDetailsPage'));
const SequenceRunDetails = lazy(() => import('@/modules/runs/pages/SequenceRunDetails'));
const SequenceRunSampleSheet = lazy(() => import('@/modules/runs/pages/SequenceRunSampleSheet'));
const SequenceRunWorkflowRuns = lazy(() => import('@/modules/runs/pages/SequenceRunWorkflowRuns'));
// const RunsPage = lazy(() => import('@/modules/runs/pages/RunsPage'));

export const Router: RouteObject = {
  path: 'runs',
  element: (
    <RunsModuleLayout>
      <Suspense fallback={<SpinnerWithText text='Loading Runs data...' />}>
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
          children: [
            { path: '', element: <SequenceRunPage /> },
            {
              path: ':instrumentRunId',
              element: <SequenceRunDetailsPage />,
              children: [
                { path: '', element: <Navigate to='details' replace /> },
                { path: 'details', element: <SequenceRunDetails /> },
                { path: 'samplesheet', element: <SequenceRunSampleSheet /> },
                { path: 'workflowruns', element: <SequenceRunWorkflowRuns /> },
              ],
            },
          ],
        },
        {
          path: 'analysis',
          children: [
            { path: '', element: <AnalysisRunPage /> },
            { path: ':orcabusId', element: <AnalysisRunDetailsPage /> },
            { path: ':analysis_orcabusId/:orcabusId', element: <WorkflowRunsDetailsPage /> },
          ],
        },
        {
          path: 'workflow',
          children: [
            { path: '', element: <WorkflowRunPage /> },
            { path: ':orcabusId', element: <WorkflowRunsDetailsPage /> },
          ],
        },
      ],
    },
  ],
};
