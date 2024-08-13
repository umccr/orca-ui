import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useUserContext } from '@/context/UserContext';

const SignInPage = lazy(() => import('@/pages/SignInPage'));
const Sequences = lazy(() => import('@/pages/Sequences'));

import MainLayout from '@/components/layouts/MainLayout';
import { LabRouter } from './LabRouter';
import { DetailedErrorBoundary } from '@/components/common/error';

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
        <Route path='sequences' element={<Sequences />} />
        <Route path='*' element={<div>Path not found/implemented!</div>} />
      </Route>
    </Routes>
  );
}
