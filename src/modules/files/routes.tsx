import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import FilesLayout from '@/components/layouts/files/FilesLayout';

const FilesPage = lazy(() => import('@/modules/files/pages/files'));

export const Router: RouteObject = {
  path: 'files',
  element: (
    <FilesLayout>
      <FilesPage />
    </FilesLayout>
  ),
};
