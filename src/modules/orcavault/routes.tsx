/* eslint-disable react-refresh/only-export-components */
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347

import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const LimsPage = lazy(() => import('@/modules/orcavault/pages/Lims'));

export const Router: RouteObject = {
  path: 'vault',
  element: (
    <>
      <LimsPage />
    </>
  ),
};
