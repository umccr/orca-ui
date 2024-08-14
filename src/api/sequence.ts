import config from '@/config';
import createClient, { ParamsOption, RequestBodyOption } from 'openapi-fetch';
import type { paths } from './types/sequence-run';
import { useSuspenseQuery } from '@tanstack/react-query';
import { authMiddleware } from './utils';

const client = createClient<paths>({ baseUrl: config.apiEndpoint.sequenceRun });
client.use(authMiddleware);

type UseQueryOptions<T> = ParamsOption<T> &
  RequestBodyOption<T> & {
    // add your custom options here
    reactQuery?: {
      // Note: React Query type’s inference is difficult to apply automatically, hence manual option passing here
      // add other React Query options as needed
    };
  };

const sequenceRunDataPath = '/api/v1/sequence/';
export function useSequenceRunDataModel({
  params,
  reactQuery,
}: UseQueryOptions<paths[typeof sequenceRunDataPath]['get']>) {
  return useSuspenseQuery({
    ...reactQuery,
    queryKey: [sequenceRunDataPath, params],
    queryFn: async ({ signal }) => {
      const { data } = await client.GET(sequenceRunDataPath, {
        params,
        signal, // allows React Query to cancel request
      });
      return data;
    },
  });
}
