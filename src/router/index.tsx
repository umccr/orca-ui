import { lazy, Suspense, useEffect } from 'react';
import { useRoutes, Navigate, Outlet, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  useEffect(() => {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.style.scrollBehavior = 'auto';
      window.scroll({ top: 0 });
      htmlElement.style.scrollBehavior = '';
    }
  }, [location.pathname]); // triggered on route change

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
        { path: '', element: <Navigate to='lab' replace /> },
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
