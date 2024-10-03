import { lazy, Suspense } from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import LibraryLayout from '@/components/layouts/lab/LibraryLayout';
import MetadataLayout from '@/components/layouts/lab/MetadataLayout';
import { DetailedErrorBoundary } from '@/components/common/error';
// import SubjectLayout from '@/components/layouts/lab/SubjectLayout';

const MetadataPage = lazy(() => import('@/modules/lab/pages/Metadata'));
// const SubjectPage = lazy(() => import('@/modules/lab/subject'));
const LibraryOverviewPage = lazy(() => import('@/modules/lab/pages/library/LibraryOverview'));
const LibraryWorkflowPage = lazy(() => import('@/modules/lab/pages/library/LibraryWorkflow'));

// const subjectRoute = {
//   path: 'subject',
//   element: (
//     <SubjectLayout>
//       <Outlet />
//     </SubjectLayout>
//   ),
//   children: [
//     {
//       path: '',
//       element: <Navigate to='/lab' replace />,
//     },
//     {
//       path: ':subjectId',
//       element: <SubjectPage />,
//     },
//   ],
// };

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
          path: ':libraryId',
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
