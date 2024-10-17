import config from '@/config';
import createClient from 'openapi-fetch';
import type { paths, components } from './types/workflow';
import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import { authMiddleware, UseSuspenseQueryOptions, UseQueryOptions } from './utils';

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

export type WorkflowModel = components['schemas']['Workflow'];
export type WorkflowRunModel = components['schemas']['WorkflowRunDetail'];

export const useWorkflowModel = createWorkflowQueryHook('/api/v1/workflow/');
export const useWorkflowRunListModel = createWorkflowQueryHook('/api/v1/workflowrun/');
export const useWorkflowRunDetailModel = createWorkflowQueryHook(
  '/api/v1/workflowrun/{orcabusId}/'
);
export const useWorkflowStateModel = createWorkflowQueryHook(
  '/api/v1/workflowrun/{wfrOrcabusId}/state/'
);
export const useWorkflowPayloadModel = createWorkflowQueryHook('/api/v1/payload/{id}/');
export const useWorkflowRunStatusCountModel = createWorkflowQueryHook(
  '/api/v1/workflowrun/count_by_status/'
);

// Use suspenseQuery hook for fetching data
export const useSuspenseWorkflowRunListModel = createWorkflowFetchingHook('/api/v1/workflowrun/');
export const useSuspenseWorkflowModel = createWorkflowFetchingHook('/api/v1/workflow/');
export const useSuspensePayloadListModel = createWorkflowFetchingHook('/api/v1/payload/');
