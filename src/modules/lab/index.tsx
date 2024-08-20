import { lazy } from 'react';
import { RouteObject } from '@/types/routeObject';
import { AppURLs } from '@/utils/appURLs';

const LabPage = lazy(() => import('@/modules/lab/Pages/Metadata'));

export const Router: RouteObject = { path: AppURLs.Lab, element: <LabPage /> };
