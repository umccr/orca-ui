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
import { env } from '@/utils/commonUtils';

const client = createClient<paths>({ baseUrl: config.apiEndpoint.workflow });
client.use(authMiddleware);

const apiVersion = env.VITE_WORKFLOW_API_VERSION;

function getVersionedPath<K extends keyof paths>(path: K): K {
  if (!apiVersion) return path;
  return path.replace('/api/v1/', `/api/${apiVersion}/`) as K;
}

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
    const versionedPath = getVersionedPath(path);
    return useSuspenseQuery<R, Error, R, [K, typeof params]>({
      ...reactQuery,
      queryKey: [versionedPath, params],
      queryFn: async () => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data, error, response } = await client.GET(versionedPath, {
          params: params as ParamsOption<paths[K][M]>,
          signal: signal,
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

export function createWorkflowQueryHook<
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

export function createWorkflowPostMutationHook<K extends keyof paths>(path: K) {
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

export function createWorkflowPatchMutationHook<K extends keyof paths>(path: K) {
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

export function createWorkflowDeleteMutationHook<K extends keyof paths>(path: K) {
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

export type WorkflowModel = components['schemas']['Workflow'];
export type WorkflowRunModel = components['schemas']['WorkflowRunDetail'];
export type AnalysisRunModel = components['schemas']['AnalysisRunDetail'];
export type AnalysisModel = components['schemas']['AnalysisMin'];
export type ComputeContextModel = components['schemas']['AnalysisContext'];
export type StorageContextModel = components['schemas']['AnalysisContext'];
export type WorkflowRunPaginatedModel = components['schemas']['PaginatedWorkflowRunDetailList'];
export type WorkflowRunRerunValidateDetailModel = components['schemas']['AllowedRerunWorkflow'];

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
  '/api/v1/workflowrun/stats/count_by_status/'
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

// workflow run state creation
export const useWorkflowRunStateCreateModel = createWorkflowPostMutationHook(
  '/api/v1/workflowrun/{orcabusId}/state/'
);
export const useWorkflowRunStateUpdateModel = createWorkflowPatchMutationHook(
  '/api/v1/workflowrun/{orcabusId}/state/{id}/'
);
export const useWorkflowRunStateValidMapModel = createWorkflowQueryHook(
  '/api/v1/workflowrun/{orcabusId}/state/valid_states_map/'
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

// rerun
export const useWorkflowRunRerunModel = createWorkflowPostMutationHook(
  '/api/v1/workflowrun/{orcabusId}/rerun/'
);
export const useWorkflowRunRerunValidateModel = createWorkflowQueryHook(
  '/api/v1/workflowrun/{orcabusId}/validate_rerun_workflows/'
);
