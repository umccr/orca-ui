import { fetchAuthSession } from 'aws-amplify/auth';
import { Middleware } from 'openapi-fetch';

export const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const accessToken = (await fetchAuthSession()).tokens?.idToken?.toString();
    request.headers.set('Authorization', `Bearer ${accessToken}`);
    return request;
  },
};
