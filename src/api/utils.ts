import { fetchAuthSession } from 'aws-amplify/auth';
import { ParamsOption, RequestBodyOption, Middleware } from 'openapi-fetch';

export const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const accessToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    request.headers.set('Authorization', `Bearer ${accessToken}`);
    return request;
  },
};

export type UseQueryOptions<T> = ParamsOption<T> &
  RequestBodyOption<T> & {
    // add your custom options here
    reactQuery?: {
      // Note: React Query type’s inference is difficult to apply automatically, hence manual option passing here
      // add other React Query options as needed
    };
  };
