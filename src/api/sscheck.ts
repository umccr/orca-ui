/* eslint-disable @typescript-eslint/no-explicit-any */
import createClient from 'openapi-fetch';
import { useMutation } from '@tanstack/react-query';
import { authMiddleware } from './utils';
import config from '@/config';

interface path {
  '/': any;
}

const client = createClient<path>({ baseUrl: config.apiEndpoint.sscheck });
client.use(authMiddleware);

export function usePostSSCheck({ params, body }: { params?: any; body: any }) {
  return useMutation({
    mutationFn: async () => {
      const { data, error, response } = await client.POST('/', { params, body });

      if (error) {
        if (typeof error === 'object') {
          throw new Error(JSON.stringify(error));
        }
        throw new Error(response.statusText);
      }

      return data;
    },
  });
}
