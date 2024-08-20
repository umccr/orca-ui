import { lazy, Suspense } from 'react';
import { useRoutes, Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '@/context/UserContext';
import Page from '@/components/common/page';
import { AppURLs } from '@/utils/appURLs';

const SignInPage = lazy(() => import('@/modules/auth/SignInPage'));
import MainLayout from '@/components/layouts/MainLayout';

import modules from './modules';

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
        ...modules.map((x) => {
          return {
            ...x.Router,
            children: Array.isArray(x.Router.children)
              ? x.Router.children.map((c) => ({
                  ...c,
                  element: <Page title={c.title}>{c.element}</Page>,
                }))
              : [],
          };
        }),
        { path: '*', element: <div>Path not found/implemented!</div> },
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
