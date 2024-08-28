import { lazy, Suspense } from 'react';
import { useRoutes, Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '@/context/UserContext';
import { AppURLs } from '@/utils/appURLs';

const SignInPage = lazy(() => import('@/modules/auth/SignInPage'));
const NotFoundPage = lazy(() => import('@/modules/error/NotFoundPage'));
import MainLayout from '@/components/layouts/MainLayout';

import modulesRouters from './modules';

export default function AppRoutes() {
  const { isAuth } = useUserContext();

  const routes = [
    {
      path: '/',
      element: isAuth ? (
        <MainLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
          </Suspense>
        </MainLayout>
      ) : (
        <Navigate to='/signIn' replace />
      ),
      children: [
        { path: '', element: <Navigate to='lab' replace /> },
        ...modulesRouters,
        { path: '*', element: <NotFoundPage /> },
      ],
    },
    // Unauthenticated routes
    {
      path: AppURLs.SignIn,
      element: <SignInPage />,
    },
    {
      path: '*',
      element: <Navigate to='/signIn' replace />,
    },
  ];
  // useRoutes hook for customize module routes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useRoutes(routes as any);
}
