import { lazy, Suspense } from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import LibraryLayout from '@/components/layouts/lab/LibraryLayout';
import MetadataLayout from '@/components/layouts/lab/MetadataLayout';
import { DetailedErrorBoundary } from '@/components/common/error';

const MetadataPage = lazy(() => import('@/modules/lab/pages/Metadata'));
const SyncPage = lazy(() => import('@/modules/lab/pages/Sync'));
const LibraryOverviewPage = lazy(() => import('@/modules/lab/pages/library/LibraryOverview'));
const LibraryWorkflowPage = lazy(() => import('@/modules/lab/pages/library/LibraryWorkflow'));
const LibraryHistoryPage = lazy(() => import('@/modules/lab/pages/library/LibraryHistory'));

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
    {
      path: 'sync',
      element: (
        <MetadataLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <SyncPage />
          </Suspense>
        </MetadataLayout>
      ),
    },
    {
      path: 'library',
      children: [
        {
          path: '',
          element: <Navigate to='/lab' replace />,
        },
        {
          path: ':libraryOrcabusId',
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
              element: <Navigate to={'overview'} />,
            },
            {
              path: 'overview',
              element: <LibraryOverviewPage />,
            },
            {
              path: 'history',
              element: <LibraryHistoryPage />,
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
