import config from '@/config';
import createClient from 'openapi-fetch';
import type { paths } from './types/sequence-run';
import { useSuspenseQuery } from '@tanstack/react-query';
import { authMiddleware, UseQueryOptions } from './utils';

const client = createClient<paths>({ baseUrl: config.apiEndpoint.sequenceRun });
client.use(authMiddleware);

function createSequenceRunFetchingHook<K extends keyof paths>(path: K) {
  return function ({ params, reactQuery }: UseQueryOptions<paths[typeof path]['get']>) {
    return useSuspenseQuery({
      ...reactQuery,
      queryKey: [path, params],
      queryFn: async ({ signal }) => {
        const { data } = await client.GET(path, {
          params,
          signal,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        return data;
      },
    });
  };
}

export const useSequenceRunListModel = createSequenceRunFetchingHook('/api/v1/sequence/');
export const useSequenceRunDetailModel = createSequenceRunFetchingHook('/api/v1/sequence/{id}/');
