import createClient, { ParamsOption, RequestBodyOption } from 'openapi-fetch';
import type { paths } from './types/metadata';
import { useSuspenseQuery } from '@tanstack/react-query';
import { authMiddleware } from './utils';

const client = createClient<paths>({ baseUrl: 'http://localhost:8000/' });
client.use(authMiddleware);

type UseQueryOptions<T> = ParamsOption<T> &
  RequestBodyOption<T> & {
    // add your custom options here
    reactQuery?: {
      // Note: React Query type’s inference is difficult to apply automatically, hence manual option passing here
      // add other React Query options as needed
    };
  };

const metadataFullSubjectPath = '/subject/full/';
export function useMetadataFullSubjectModel({
  params,
  reactQuery,
}: UseQueryOptions<paths[typeof metadataFullSubjectPath]['get']>) {
  return useSuspenseQuery({
    ...reactQuery,
    retry: 0,
    queryKey: [metadataFullSubjectPath, params],
    queryFn: async ({ signal }) => {
      const { data } = await client.GET(metadataFullSubjectPath, {
        params,
        signal, // allows React Query to cancel request
      });
      return data;
    },
  });
}
