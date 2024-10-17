import config from '@/config';
import createClient from 'openapi-fetch';
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

export function createWorkflowFetchingHook<K extends keyof paths>(path: K) {
  return function ({ params, reactQuery }: UseSuspenseQueryOptions<paths[typeof path]['get']>) {
    return useSuspenseQuery({
      ...reactQuery,
      queryKey: [path, params],
      queryFn: async ({ signal }) => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data } = await client.GET(path, { params, signal });
        return data;
      },
    });
  };
}

export function createWorkflowQueryHook<K extends keyof paths>(path: K) {
  return function ({ params, reactQuery }: UseQueryOptions<paths[typeof path]['get']>) {
    return useQuery({
      ...reactQuery,
      queryKey: [path, params],
      queryFn: async ({ signal }) => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data } = await client.GET(path, { params, signal });
        return data;
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
  return function ({ params, reactQuery }: UseMutationOptions<paths[typeof path]['delete']>) {
    return useMutation({
      ...reactQuery,
      mutationFn: async () => {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        const { data } = await client.DELETE(path, { params });
        return data;
      },
    });
  };
}

export type WorkflowModel = components['schemas']['WorkflowModel'];
export type WorkflowRunModel = components['schemas']['WorkflowRunModel'];

export const useWorkflowModel = createWorkflowQueryHook('/api/v1/workflow/');
export const useWorkflowRunListModel = createWorkflowQueryHook('/api/v1/workflowrun/');
export const useWorkflowRunDetailModel = createWorkflowQueryHook('/api/v1/workflowrun/{id}/');
export const useWorkflowStateModel = createWorkflowQueryHook(
  '/api/v1/workflowrun/{workflowrunId}/state/'
);
export const useWorkflowPayloadModel = createWorkflowQueryHook('/api/v1/payload/{id}/');
export const useWorkflowRunStatusCountModel = createWorkflowQueryHook(
  '/api/v1/workflowrun/count_by_status/'
);

// workflowrun comment api
export const useWorkflowRunCommentModel = createWorkflowQueryHook(
  '/api/v1/workflowrun/{workflowrunId}/comments/'
);
export const useWorkflowRunCommentCreateModel = createWorkflowPostMutationHook(
  '/api/v1/workflowrun/{workflowrunId}/comments/'
);
export const useWorkflowRunCommentUpdateModel = createWorkflowPatchMutationHook(
  '/api/v1/workflowrun/{workflowrunId}/comments/{id}/'
);

export const useWorkflowRunCommentDeleteModel = createWorkflowDeleteMutationHook(
  '/api/v1/workflowrun/{workflowrunId}/comments/{id}/'
);

// workflow run state "RESOLVED"
export const useWorkflowRunResolvedStateCreateModel = createWorkflowPostMutationHook(
  '/api/v1/workflowrun/{workflowrunId}/state/'
);

export const useWorkflowRunResolvedStateUpdateModel = createWorkflowPatchMutationHook(
  '/api/v1/workflowrun/{workflowrunId}/state/{id}/'
);

// Use suspenseQuery hook for fetching data
export const useSuspenseWorkflowRunListModel = createWorkflowFetchingHook('/api/v1/workflowrun/');
export const useSuspenseWorkflowModel = createWorkflowFetchingHook('/api/v1/workflow/');
export const useSuspensePayloadListModel = createWorkflowFetchingHook('/api/v1/payload/');
