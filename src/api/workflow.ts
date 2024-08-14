import config from '@/config';
import createClient, { ParamsOption, RequestBodyOption } from 'openapi-fetch';
import type { paths } from './types/workflow';
import { useSuspenseQuery } from '@tanstack/react-query';
import { authMiddleware } from './utils';

const client = createClient<paths>({ baseUrl: config.apiEndpoint.workflow });
client.use(authMiddleware);

type UseQueryOptions<T> = ParamsOption<T> &
  RequestBodyOption<T> & {
    // add your custom options here
    reactQuery?: {
      // Note: React Query type’s inference is difficult to apply automatically, hence manual option passing here
      // add other React Query options as needed
    };
  };

const workflowPath = '/api/v1/workflow/';
export function useWorkflowModel({
  params,
  reactQuery,
}: UseQueryOptions<paths[typeof workflowPath]['get']>) {
  return useSuspenseQuery({
    ...reactQuery,
    queryKey: [workflowPath, params],
    queryFn: async ({ signal }) => {
      // const { data } = await client.GET(workflowPath, {
      //   params,
      //   signal, // allows React Query to cancel request
      // });

      const data = {
        links: {
          next: null,
          previous: null,
        },
        pagination: {
          count: 3,
          page: 1,
          rowsPerPage: 10,
        },
        results: [],
      };
      return data;
    },
  });
}

const workflowrunPath = '/api/v1/workflowrun/';
export function useWorkflowrunModel({
  params,
  reactQuery,
}: UseQueryOptions<paths[typeof workflowrunPath]['get']>) {
  return useSuspenseQuery({
    ...reactQuery,
    queryKey: [workflowrunPath, params],
    queryFn: async ({ signal }) => {
      // const { data } = await client.GET(workflowrunPath, {
      //   params,
      //   signal, // allows React Query to cancel request
      // });

      const data = {
        links: {
          next: null,
          previous: null,
        },
        pagination: {
          count: 2,
          page: 1,
          rowsPerPage: 10,
        },
        results: [],
      };
      return data;
    },
  });
}
