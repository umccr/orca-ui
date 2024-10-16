import { lazy, Suspense } from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import LibraryLayout from '@/components/layouts/lab/LibraryLayout';
import MetadataLayout from '@/components/layouts/lab/MetadataLayout';
import { DetailedErrorBoundary } from '@/components/common/error';

const MetadataPage = lazy(() => import('@/modules/lab/pages/Metadata'));
const LibraryOverviewPage = lazy(() => import('@/modules/lab/pages/library/LibraryOverview'));
const LibraryWorkflowPage = lazy(() => import('@/modules/lab/pages/library/LibraryWorkflow'));

export const Router: RouteObject = {
  path: 'lab',
  element: (
    <DetailedErrorBoundary>
      <Outlet />
    </DetailedErrorBoundary>
  ),
  children: [
    {
      path: '',
      element: (
        <MetadataLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <MetadataPage />
          </Suspense>
        </MetadataLayout>
      ),
    },
    // subjectRoute,
    {
      path: 'library',
      element: (
        <DetailedErrorBoundary errorTitle='Unable to load library'>
          <LibraryLayout>
            <Outlet />
          </LibraryLayout>
        </DetailedErrorBoundary>
      ),
      children: [
        {
          path: '',
          element: <Navigate to='/lab' replace />,
        },
        {
          path: ':libraryOrcabusId',
          children: [
            {
              path: '',
              element: <LibraryOverviewPage />,
            },
            {
              path: ':workflowType',
              children: [
                {
                  path: '',
                  element: <LibraryWorkflowPage />,
                },
                {
                  path: ':portalRunId',
                  element: <LibraryWorkflowPage />,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to='/' replace />,
    },
  ],
};
