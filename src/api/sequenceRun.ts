import config from '@/config';
import createClient, { ParamsOption } from 'openapi-fetch';
import type { paths, components } from './types/sequence-run';
import { useSuspenseQuery, useQuery, useMutation } from '@tanstack/react-query';
import {
  authMiddleware,
  UseSuspenseQueryOptions,
  UseQueryOptions,
  UseMutationOptions,
} from './utils';
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
        const { data, error, response } = await client.GET(versionedPath, { params, signal });

        if (error) {
          if (typeof error === 'object') {
            throw new Error(JSON.stringify(error));
          }
          throw new Error((response as Response).statusText);
        }
        return data;
      },
    });
  };
}

export function createSequenceRunQueryHook<
  K extends keyof paths,
  M extends keyof paths[K] & 'get',
  R = paths[K][M] extends { responses: { 200: { content: { 'application/json': infer T } } } }
    ? T
    : never,
>(path: K) {
  const versionedPath = getVersionedPath(path);
  return function ({
    params,
    reactQuery,
    signal,
  }: Omit<UseQueryOptions<paths[K][M]>, 'queryKey' | 'queryFn'> & { signal?: AbortSignal }) {
    return useQuery<R, Error, R, [K, typeof params]>({
      ...reactQuery,
      queryKey: [versionedPath, params],
      queryFn: async ({ signal: querySignal }) => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data, error, response } = await client.GET(versionedPath, {
          params: params as ParamsOption<paths[K][M]>,
          signal: signal || querySignal,
        });

        if (error) {
          if (typeof error === 'object') {
            throw new Error(JSON.stringify(error));
          }
          throw new Error((response as Response).statusText);
        }
        return data as R;
      },
    });
  };
}

export function createSequenceRunPostMutationHook<K extends keyof paths>(path: K) {
  return function ({ params, reactQuery, body }: UseMutationOptions<paths[typeof path]['post']>) {
    const versionedPath = getVersionedPath(path);
    return useMutation({
      ...reactQuery,
      mutationFn: async () => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data, error, response } = await client.POST(versionedPath, { params, body: body });

        if (error) {
          if (typeof error === 'object') {
            throw new Error(JSON.stringify(error));
          }
          throw new Error((response as Response).statusText);
        }
        return data;
      },
    });
  };
}

export function createSequenceRunPatchMutationHook<K extends keyof paths>(path: K) {
  return function ({ params, reactQuery, body }: UseMutationOptions<paths[typeof path]['patch']>) {
    const versionedPath = getVersionedPath(path);
    return useMutation({
      ...reactQuery,
      mutationFn: async () => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data, error, response } = await client.PATCH(versionedPath, { params, body: body });

        if (error) {
          if (typeof error === 'object') {
            throw new Error(JSON.stringify(error));
          }
          throw new Error((response as Response).statusText);
        }
        return data;
      },
    });
  };
}

export function createSequenceRunDeleteMutationHook<K extends keyof paths>(path: K) {
  return function ({ params, reactQuery, body }: UseMutationOptions<paths[typeof path]['delete']>) {
    const versionedPath = getVersionedPath(path);
    return useMutation({
      ...reactQuery,
      mutationFn: async () => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data, error, response } = await client.DELETE(versionedPath, {
          params,
          body: body,
        });

        if (error) {
          if (typeof error === 'object') {
            throw new Error(JSON.stringify(error));
          }
          throw new Error((response as Response).statusText);
        }
        return data;
      },
    });
  };
}

export type SequenceRunModel = components['schemas']['Sequence'];

export const useSequenceRunListModel = createSequenceRunQueryHook('/api/v1/sequence/');
export const useSequenceRunDetailModel = createSequenceRunQueryHook('/api/v1/sequence/{id}/');
export const useSequenceRunStateListModel = createSequenceRunQueryHook(
  '/api/v1/sequence/{orcabusId}/state/'
);
export const useSequenceRunCommentListModel = createSequenceRunQueryHook(
  '/api/v1/sequence/{orcabusId}/comment/'
);
export const useSequenceRunCommentCreateModel = createSequenceRunPostMutationHook(
  '/api/v1/sequence/{orcabusId}/comment/'
);
export const useSequenceRunCommentUpdateModel = createSequenceRunPatchMutationHook(
  '/api/v1/sequence/{orcabusId}/comment/{id}/'
);
export const useSequenceRunCommentDeleteModel = createSequenceRunDeleteMutationHook(
  '/api/v1/sequence/{orcabusId}/comment/{id}/soft_delete/'
);

export const useSequenceRunStatusCountModel = createSequenceRunQueryHook(
  '/api/v1/sequence/stats/status_counts/'
);

export const useSequenceRunSampleSheetModel = createSequenceRunQueryHook(
  '/api/v1/sequence/{orcabusId}/get_sample_sheet/'
);
