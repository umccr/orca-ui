import config from '@/config';
import createClient, { ParamsOption } from 'openapi-fetch';
import type { paths, components } from './types/workflow';
import { useSuspenseQuery, useQuery, useMutation } from '@tanstack/react-query';
import {
  authMiddleware,
  UseSuspenseQueryOptions,
  UseQueryOptions,
  UseMutationOptions,
} from './utils';

const client = createClient<paths>({ baseUrl: config.apiEndpoint.workflow });
client.use(authMiddleware);

export function createWorkflowFetchingHook<
  K extends keyof paths,
  M extends keyof paths[K] & 'get',
  R = paths[K][M] extends { responses: { 200: { content: { 'application/json': infer T } } } }
    ? T
    : never,
>(path: K) {
  return function ({
    params,
    reactQuery,
    signal,
  }: Omit<UseSuspenseQueryOptions<paths[typeof path][M]>, 'queryKey' | 'queryFn'> & {
    signal?: AbortSignal;
  }) {
    return useSuspenseQuery<R, Error, R, [K, typeof params]>({
      ...reactQuery,
      queryKey: [path, params],
      queryFn: async () => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data } = await client.GET(path, {
          params: params as ParamsOption<paths[K][M]>,
          signal: signal,
        });
        return data as R;
      },
    });
  };
}

export function createWorkflowQueryHook<
  K extends keyof paths,
  M extends keyof paths[K] & 'get',
  R = paths[K][M] extends { responses: { 200: { content: { 'application/json': infer T } } } }
    ? T
    : never,
>(path: K) {
  return function ({
    params,
    reactQuery,
    signal,
  }: Omit<UseQueryOptions<paths[K][M]>, 'queryKey' | 'queryFn'> & { signal?: AbortSignal }) {
    return useQuery<R, Error, R, [K, typeof params]>({
      ...reactQuery,
      queryKey: [path, params],
      queryFn: async ({ signal: querySignal }) => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data } = await client.GET(path, {
          params: params as ParamsOption<paths[K][M]>,
          signal: signal || querySignal,
        });
        return data as R;
      },
    });
  };
}

export function createWorkflowPostMutationHook<K extends keyof paths>(path: K) {
  return function ({ params, reactQuery, body }: UseMutationOptions<paths[typeof path]['post']>) {
    return useMutation({
      ...reactQuery,
      mutationFn: async () => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data } = await client.POST(path, { params, body: body });
        return data;
      },
    });
  };
}

export function createWorkflowPatchMutationHook<K extends keyof paths>(path: K) {
  return function ({ params, reactQuery, body }: UseMutationOptions<paths[typeof path]['patch']>) {
    return useMutation({
      ...reactQuery,
      mutationFn: async () => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data } = await client.PATCH(path, { params, body: body });
        return data;
      },
    });
  };
}

export function createWorkflowDeleteMutationHook<K extends keyof paths>(path: K) {
  return function ({ params, reactQuery, body }: UseMutationOptions<paths[typeof path]['delete']>) {
    return useMutation({
      ...reactQuery,
      mutationFn: async () => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data } = await client.DELETE(path, { params, body: body });
        return data;
      },
    });
  };
}

export type WorkflowModel = components['schemas']['Workflow'];
export type WorkflowRunModel = components['schemas']['WorkflowRunDetail'];
export type AnalysisRunModel = components['schemas']['AnalysisRunDetail'];
export type AnalysisModel = components['schemas']['Analysis'];
export type ComputeContextModel = components['schemas']['AnalysisContext'];
export type StorageContextModel = components['schemas']['AnalysisContext'];

export const useWorkflowModel = createWorkflowQueryHook('/api/v1/workflow/');
export const useWorkflowRunListModel = createWorkflowQueryHook('/api/v1/workflowrun/');
export const useWorkflowRunDetailModel = createWorkflowQueryHook(
  '/api/v1/workflowrun/{orcabusId}/'
);
export const useWorkflowStateModel = createWorkflowQueryHook(
  '/api/v1/workflowrun/{orcabusId}/state/'
);
export const useWorkflowPayloadModel = createWorkflowQueryHook('/api/v1/payload/{id}/');

export const useWorkflowRunStatusCountModel = createWorkflowQueryHook(
  '/api/v1/workflowrun/count_by_status/'
);

export const useWorkflowRunCommentModel = createWorkflowQueryHook(
  '/api/v1/workflowrun/{orcabusId}/comment/'
);
export const useWorkflowRunCommentCreateModel = createWorkflowPostMutationHook(
  '/api/v1/workflowrun/{orcabusId}/comment/'
);
export const useWorkflowRunCommentUpdateModel = createWorkflowPatchMutationHook(
  '/api/v1/workflowrun/{orcabusId}/comment/{id}/'
);

export const useWorkflowRunCommentDeleteModel = createWorkflowDeleteMutationHook(
  '/api/v1/workflowrun/{orcabusId}/comment/{id}/soft_delete/'
);

// workflow run state "RESOLVED"
export const useWorkflowRunResolvedStateCreateModel = createWorkflowPostMutationHook(
  '/api/v1/workflowrun/{orcabusId}/state/'
);

export const useWorkflowRunResolvedStateUpdateModel = createWorkflowPatchMutationHook(
  '/api/v1/workflowrun/{orcabusId}/state/{id}/'
);

// Use suspenseQuery hook for fetching data
export const useSuspenseWorkflowRunListModel = createWorkflowFetchingHook('/api/v1/workflowrun/');
export const useSuspenseWorkflowModel = createWorkflowFetchingHook('/api/v1/workflow/');
export const useSuspensePayloadListModel = createWorkflowFetchingHook('/api/v1/payload/');

// analysis run
export const useAnalysisRunListModel = createWorkflowQueryHook('/api/v1/analysisrun/');
export const useAnalysisRunDetailModel = createWorkflowQueryHook(
  '/api/v1/analysisrun/{orcabusId}/'
);
