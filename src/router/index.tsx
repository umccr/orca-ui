import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from '@/context/UserContext';

const SignInPage = lazy(() => import('@/pages/SignInPage'));
const Sequences = lazy(() => import('@/pages/Sequences'));

import MainLayout from '@/components/layouts/MainLayout';
import MetadataPage from '@/pages/Metadata';

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
        <Route index element={<Navigate to='metadata' />} />
        <Route path='lab' element={<MetadataPage />} />
        <Route path='sequences' element={<Sequences />} />
        <Route path='*' element={<div>Path not found/implemented!</div>} />
      </Route>
    </Routes>
  );
}
