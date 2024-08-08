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

const workflowRunDataPath = '/wfm/v1/workflowrun/';
export function useWorkflowRunDataModel({
  params,
  reactQuery,
}: UseQueryOptions<paths[typeof workflowRunDataPath]['get']>) {
  return useSuspenseQuery({
    ...reactQuery,
    queryKey: [workflowRunDataPath, params],
    queryFn: async ({ signal }) => {
      const { data } = await client.GET(workflowRunDataPath, {
        params,
        signal, // allows React Query to cancel request
      });
      return data;
    },
  });
}
