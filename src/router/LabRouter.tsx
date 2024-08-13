import LibraryLayout from '@/components/layouts/lab/LibraryLayout';
import MetadataLayout from '@/components/layouts/lab/MetadataLayout';
import SubjectLayout from '@/components/layouts/lab/SubjectLayout';
import { lazy } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

const LabPage = lazy(() => import('@/pages/Lab/metadata'));
const SubjectPage = lazy(() => import('@/pages/Lab/subject'));
const LibraryOverviewPage = lazy(() => import('@/pages/Lab/library/overview'));
const LibraryWorkflowPage = lazy(() => import('@/pages/Lab/library/workflow'));

export const LabRouter = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <MetadataLayout>
            <LabPage />
          </MetadataLayout>
        }
      />
      <Route path='subject/*' element={<SubjectRoute />} />
      <Route path='library/*' element={<LibraryRoute />} />

      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  );
};

const SubjectRoute = () => (
  <Routes>
    <Route element={<SubjectLayout />}>
      <Route index element={<Navigate to='../' />} />
      <Route path=':subjectId' element={<SubjectPage />} />
    </Route>
  </Routes>
);

const LibraryRoute = () => (
  <Routes>
    <Route
      element={
        <LibraryLayout>
          <Outlet />
        </LibraryLayout>
      }
    >
      <Route index element={<Navigate to='../' />} />
      <Route path=':libraryId'>
        <Route index element={<LibraryOverviewPage />} />
        <Route path=':workflowType'>
          <Route index element={<LibraryWorkflowPage />} />
          <Route path=':portalRunId' element={<LibraryWorkflowPage />} />
        </Route>
      </Route>
    </Route>
  </Routes>
);
