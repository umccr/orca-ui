import config from '@/config';
import createClient from 'openapi-fetch';
import type { paths } from './types/workflow';
import { useSuspenseQuery } from '@tanstack/react-query';
import { authMiddleware, UseSuspenseQueryOptions } from './utils';

const client = createClient<paths>({ baseUrl: config.apiEndpoint.workflow });
client.use(authMiddleware);

const workflowPath = '/api/v1/workflow/';
export function useWorkflowModel({
  params,
  reactQuery,
}: UseSuspenseQueryOptions<paths[typeof workflowPath]['get']>) {
  return useSuspenseQuery({
    ...reactQuery,
    queryKey: [workflowPath, params],
    queryFn: async ({ signal }) => {
      const { data } = await client.GET(workflowPath, {
        params,
        signal, // allows React Query to cancel request
      });

      return data;
    },
  });
}

const workflowrunPath = '/api/v1/workflowrun/';
export function useWorkflowrunModel({
  params,
  reactQuery,
}: UseSuspenseQueryOptions<paths[typeof workflowrunPath]['get']>) {
  return useSuspenseQuery({
    ...reactQuery,
    queryKey: [workflowrunPath, params],
    queryFn: async ({ signal }) => {
      const { data } = await client.GET(workflowrunPath, {
        params,
        signal, // allows React Query to cancel request
      });

      return data;
    },
  });
}
