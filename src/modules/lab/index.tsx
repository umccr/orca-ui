import { lazy } from 'react';
import { Navigate, Outlet, Route, Routes, RouteObject } from 'react-router-dom';
// import { RouteObject } from '@/types/routeObject';
import LibraryLayout from '@/components/layouts/lab/LibraryLayout';
import MetadataLayout from '@/components/layouts/lab/MetadataLayout';
import SubjectLayout from '@/components/layouts/lab/SubjectLayout';
import { path } from 'd3';

const LabPage = lazy(() => import('@/modules/lab/metadata'));
const SubjectPage = lazy(() => import('@/modules/lab/subject'));
const LibraryOverviewPage = lazy(() => import('@/modules/lab/library/overview'));
const LibraryWorkflowPage = lazy(() => import('@/modules/lab/library/workflow'));

// export const LabRouter = () => {
//   return (
//     <Routes>
//       <Route
//         index
//         element={
//           <MetadataLayout>
//             <LabPage />
//           </MetadataLayout>
//         }
//       />
//       <Route path='subject/*' element={<SubjectRoute />} />
//       <Route path='library/*' element={<LibraryRoute />} />

//       <Route path='*' element={<Navigate to='/' />} />
//     </Routes>
//   );
// };

// const SubjectRoute = () => (
//   <Routes>
//     <Route element={<SubjectLayout />}>
//       <Route index element={<Navigate to='../' />} />
//       <Route path=':subjectId' element={<SubjectPage />} />
//     </Route>
//   </Routes>
// );

// const LibraryRoute = () => (
//   <Routes>
//     <Route
//       element={
//         <LibraryLayout>
//           <Outlet />
//         </LibraryLayout>
//       }
//     >
//       <Route index element={<Navigate to='../' />} />
//       <Route path=':libraryId'>
//         <Route index element={<LibraryOverviewPage />} />
//         <Route path=':workflowType'>
//           <Route index element={<LibraryWorkflowPage />} />
//           <Route path=':portalRunId' element={<LibraryWorkflowPage />} />
//         </Route>
//       </Route>
//     </Route>
//   </Routes>
// );

export const Router: RouteObject = {
  path: 'lab',
  element: <Outlet />,
  children: [
    {
      path: '',
      element: (
        <MetadataLayout>
          <LabPage />
        </MetadataLayout>
      ),
    },
    {
      path: 'subject',
      element: (
        <SubjectLayout>
          <Outlet />
        </SubjectLayout>
      ),
      children: [
        {
          path: '',
          element: <Navigate to='/lab' replace />,
        },
        {
          path: ':subjectId',
          element: <SubjectPage />,
        },
      ],
    },
    {
      path: 'library',
      element: (
        <LibraryLayout>
          <Outlet />
        </LibraryLayout>
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
