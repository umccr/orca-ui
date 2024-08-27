import { RouteObject as ReactRouteObject } from 'react-router-dom';

export type RouteObject = Omit<ReactRouteObject, 'children'> & {
  children?: RouteObject[];
};
