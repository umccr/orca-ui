/* eslint-disable react-refresh/only-export-components */
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347

import SSCheckLayout from '@/components/layouts/sscheck/SSCheckLayout';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const SSCheckPage = lazy(() => import('@/modules/sscheck/pages/SSCheck'));

export const Router: RouteObject = {
  path: 'sscheck',
  element: (
    <SSCheckLayout>
      <SSCheckPage />
    </SSCheckLayout>
  ),
};
