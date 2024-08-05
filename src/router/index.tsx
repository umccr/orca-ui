import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '@/context/UserContext';

const SignInPage = lazy(() => import('@/pages/SignInPage'));
const Sequences = lazy(() => import('@/pages/Sequences'));

import MainLayout from '@/components/layouts/MainLayout';
import LabPage from '@/pages/Lab';
import { FileViewer } from '@/components/files';

export default function AppRoutes() {
  const isUserSignedIn = useUserContext().isAuth;

  if (!isUserSignedIn) {
    return (
      <Routes>
        <Route path='/signIn' element={<SignInPage />} />
        <Route path='*' element={<Navigate replace to='signIn' />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route
        path='/'
        element={
          <MainLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </MainLayout>
        }
      >
        <Route index element={<Navigate to='lab' />} />
        <Route path='lab' element={<LabPage />} />
        <Route path='runs' element={<Sequences />} />
        <Route
          path='*'
          element={
            <div>
              <FileViewer s3Key='photo upload.png' bucket='elsa-data-example-bucket-1' />
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
