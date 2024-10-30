import config from '@/config';
import createClient from 'openapi-fetch';
import type { paths, components } from './types/sequence-run';
import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import { authMiddleware, UseSuspenseQueryOptions, UseQueryOptions } from './utils';
import { env } from '@/utils/commonUtils';

const client = createClient<paths>({ baseUrl: config.apiEndpoint.sequenceRun });
client.use(authMiddleware);

const apiVersion = env.VITE_SEQUENCE_RUN_API_VERSION;

function getVersionedPath<K extends keyof paths>(path: K): K {
  if (!apiVersion) return path;
  return path.replace('/api/v1/', `/api/${apiVersion}/`) as K;
}

export function createSequenceRunFetchingHook<K extends keyof paths>(path: K) {
  return function ({ params, reactQuery }: UseSuspenseQueryOptions<paths[typeof path]['get']>) {
    const versionedPath = getVersionedPath(path);
    return useSuspenseQuery({
      ...reactQuery,
      queryKey: [path, params],
      queryFn: async ({ signal }) => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data } = await client.GET(versionedPath, { params, signal });
        return data;
      },
    });
  };
}

export function createSequenceRunQueryHook<K extends keyof paths>(path: K) {
  return function ({ params, reactQuery }: UseQueryOptions<paths[typeof path]['get']>) {
    const versionedPath = getVersionedPath(path);
    return useQuery({
      ...reactQuery,
      queryKey: [path, params],
      queryFn: async ({ signal }) => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data } = await client.GET(versionedPath, { params, signal });
        return data;
      },
    });
  };
}

export type SequenceRunModel = components['schemas']['Sequence'];

export const useSequenceRunListModel = createSequenceRunQueryHook('/api/v1/sequence/');
export const useSequenceRunDetailModel = createSequenceRunQueryHook('/api/v1/sequence/{id}/');
