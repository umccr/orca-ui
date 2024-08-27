import { fetchAuthSession } from 'aws-amplify/auth';
import { Middleware, ParamsOption, RequestBodyOption } from 'openapi-fetch';

export const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const accessToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    request.headers.set('Authorization', `Bearer ${accessToken}`);
    return request;
  },
};

export type UseSuspenseQueryOptions<T> = RequestBodyOption<T> & {
  // add your custom options here
  reactQuery?: {
    // Note: React Query type’s inference is difficult to apply automatically, hence manual option passing here
    // add other React Query options as needed
  };
  // Some of query attribute (e.g. django query style, file-manager attribute linking) is not in the OpenAPI schema
  params: Omit<ParamsOption<T>['params'], 'query'> & {
    query?: Record<string, unknown>;
  };
  headers?: Record<string, string>;
};
