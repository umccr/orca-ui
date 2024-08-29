import config from '@/config';
import createClient from 'openapi-fetch';
import type { paths } from './types/workflow';
import { useSuspenseQuery } from '@tanstack/react-query';
import { authMiddleware, UseSuspenseQueryOptions } from './utils';

const client = createClient<paths>({ baseUrl: config.apiEndpoint.workflow });
client.use(authMiddleware);

function createWorkflowFetchingHook<K extends keyof paths>(path: K) {
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

export const useWorkflowModel = createWorkflowFetchingHook('/api/v1/workflow/');
export const useWorkflowRunListModel = createWorkflowFetchingHook('/api/v1/workflowrun/');
export const useWorkflowRunDetailModel = createWorkflowFetchingHook('/api/v1/workflowrun/{id}/');
