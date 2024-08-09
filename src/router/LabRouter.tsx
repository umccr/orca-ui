import LibraryLayout from '@/components/layouts/lab/LibraryLayout';
import MetadataLayout from '@/components/layouts/lab/MetadataLayout';
import SubjectLayout from '@/components/layouts/lab/SubjectLayout';
import { lazy } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';

const LabPage = lazy(() => import('@/pages/Lab/metadata'));
const SubjectPage = lazy(() => import('@/pages/Lab/subject'));
const LibraryPage = lazy(() => import('@/pages/Lab/library/overview'));

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
      <Route
        path='subject'
        element={
          <SubjectLayout>
            <Outlet />
          </SubjectLayout>
        }
      >
        <Route index element={<Navigate to='../' />} />
        <Route path=':subjectId' element={<SubjectPage />} />
      </Route>
      <Route
        path='library'
        element={
          <LibraryLayout>
            <Outlet />
          </LibraryLayout>
        }
      >
        <Route index element={<Navigate to='../' />} />
        <Route path=':libraryId' element={<LibraryPage />} />
      </Route>
    </Routes>
  );
};
