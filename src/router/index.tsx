import { lazy, Suspense } from 'react';
import { useRoutes, Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import { AppURLs } from '@/utils/appURLs';
import { SpinnerWithText } from '@/components/common/spinner';

const SignInPage = lazy(() => import('@/modules/auth/SignInPage'));
const NotFoundPage = lazy(() => import('@/modules/error/NotFoundPage'));
const MainLayout = lazy(() => import('@/components/layouts/MainLayout'));

// import all modules routes
import modulesRouters from './modules';

export default function AppRoutes() {
  const { isAuthenticated } = useAuthContext();
  const routes = [
    {
      path: '/',
      element: isAuthenticated ? (
        <MainLayout>
          <Suspense fallback={<SpinnerWithText text='Loading ...' />}>
            <Outlet />
          </Suspense>
        </MainLayout>
      ) : (
        <Navigate to='/signIn' replace />
      ),
      children: [
        { path: '', element: <Navigate to='runs' replace /> },
        ...modulesRouters,
        { path: '*', element: <NotFoundPage /> },
      ],
    },
    // Unauthenticated routes
    {
      path: AppURLs.SignIn,
      element: (
        <Suspense fallback={<SpinnerWithText text='Loading ...' />}>
          <SignInPage />
        </Suspense>
      ),
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
