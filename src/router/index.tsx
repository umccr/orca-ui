import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useUserContext } from '@/context/UserContext';

const SignInPage = lazy(() => import('@/pages/SignInPage'));
const Sequence = lazy(() => import('@/pages/Runs/sequence'));
const Library = lazy(() => import('@/pages/Runs/library'));
const Workflow = lazy(() => import('@/pages/Runs/workflow'));

import MainLayout from '@/components/layouts/MainLayout';
import { LabRouter } from './LabRouter';
import { DetailedErrorBoundary } from '@/components/common/error';
import RunsModuleLayout from '@/components/layouts/RunsModuleLayout';

export default function AppRoutes() {
  const isUserSignedIn = useUserContext().isAuth;
  const navigate = useNavigate();

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
              <DetailedErrorBoundary onCloseError={() => navigate('/')}>
                <Outlet />
              </DetailedErrorBoundary>
            </Suspense>
          </MainLayout>
        }
      >
        <Route index element={<Navigate to='lab' />} />
        <Route path='lab/*' element={<LabRouter />} />
        <Route
          path='runs'
          element={
            <RunsModuleLayout>
              <Outlet />
            </RunsModuleLayout>
          }
        >
          <Route index element={<Navigate to='sequence' />} />
          <Route path='sequence' element={<Sequence />} />
          <Route path='library' element={<Library />} />
          <Route path='workflow' element={<Workflow />} />
        </Route>
        <Route path='*' element={<div>Path not found/implemented!</div>} />
      </Route>
    </Routes>
  );
}
