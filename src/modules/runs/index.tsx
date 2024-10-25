import { lazy, Suspense } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// import { RouteObject } from '@/types/routeObject';
// import { AppURLs } from '@/utils/appURLs';
import RunsPageLayout from '@/components/layouts/runs/RunsPageLayout';
import { RouteObject } from 'react-router-dom';

const LibraryRunPage = lazy(() => import('@/modules/runs/Pages/LibraryRuns'));
const SequenceRunDetailsPage = lazy(() => import('@/modules/runs/Pages/SequenceRunDetails'));
const SequenceRunPage = lazy(() => import('@/modules/runs/Pages/SequenceRuns'));
const WorkflowRunPage = lazy(() => import('@/modules/runs/Pages/WorkflowRuns'));
const WorkflowRunDetailsPage = lazy(() => import('@/modules/runs/Pages/WorkflowRunDetails'));
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
        { path: 'sequence', element: <SequenceRunPage /> },
        { path: 'analysis', element: <AnalysisRunPage /> },
        { path: 'library', element: <LibraryRunPage /> },
        { path: 'workflow', element: <WorkflowRunPage /> },
      ],
    },

    {
      path: 'sequence/:id',
      element: <SequenceRunDetailsPage />,
    },
    {
      path: 'workflow/:orcabusId',
      element: <WorkflowRunDetailsPage />,
    },
    {
      path: 'analysis/:orcabusId',
      element: <AnalysisRunDetailsPage />,
    },
    {
      path: 'analysis/:analysis_orcabusId/:orcabusId',
      element: <WorkflowRunDetailsPage />,
    },
  ],
};
