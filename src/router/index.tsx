import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '@/context/UserContext';

const SignInPage = lazy(() => import('@/pages/SignInPage'));
const Sequences = lazy(() => import('@/pages/Sequences'));

import MainLayout from '@/components/layouts/MainLayout';

export default function AppRoutes() {
  const isUserSignedIn = useUserContext().isAuth;

  if (!isUserSignedIn) {
    console.log('User is not signed in');
    return (
      <Routes>
        <Route path='/signIn' element={<SignInPage />} />
        <Route path='*' element={<Navigate replace to='signIn' />} />
      </Routes>
    );
  }

  //   return useRoutes([
  //     {
  //       path: '/',
  //       element: (
  //         <MainLayout>
  //           <Suspense>
  //             <Outlet />
  //           </Suspense>
  //         </MainLayout>
  //       ),
  //       children: [
  //         { index: true, element: <Navigate to='sequences' /> },
  //         { path: 'sequences', element: <Sequences /> },
  //       ],
  //     },
  //   ]);

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
        <Route index element={<Navigate to='sequences' />} />
        <Route path='sequences' element={<Sequences />} />
      </Route>
    </Routes>
  );
}
