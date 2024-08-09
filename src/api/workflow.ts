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

const workflowPath = '/wfm/v1/workflow/';
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
        results: [
          {
            id: 265,
            workflowName: 'wts',
            workflowVersion: '4.2.4',
            executionEngine: 'Unknown',
            executionEnginePipelineId: 'Unknown',
            approvalState: 'RESEARCH',
          },
          {
            id: 232,
            workflowName: 'tumor_normal',
            workflowVersion: '4.2.4',
            executionEngine: 'Unknown',
            executionEnginePipelineId: 'Unknown',
            approvalState: 'RESEARCH',
          },
          {
            id: 135,
            workflowName: 'cttsov2',
            workflowVersion: '2.6.0',
            executionEngine: 'Unknown',
            executionEnginePipelineId: 'Unknown',
            approvalState: 'RESEARCH',
          },
        ],
      };
      return data;
    },
  });
}
