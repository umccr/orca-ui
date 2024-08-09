import config from '@/config';
import createClient, { ParamsOption, RequestBodyOption } from 'openapi-fetch';
import type { paths } from './types/metadata';
import { useSuspenseQuery } from '@tanstack/react-query';
import { authMiddleware } from './utils';

const client = createClient<paths>({ baseUrl: config.apiEndpoint.metadata });
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

const metadataFullLibraryPath = '/library/full/';
export function useMetadataFullLibraryModel({
  params,
  reactQuery,
}: UseQueryOptions<paths[typeof metadataFullLibraryPath]['get']>) {
  return useSuspenseQuery({
    ...reactQuery,
    queryKey: [metadataFullLibraryPath, params],
    queryFn: async ({ signal }) => {
      const { data } = await client.GET(metadataFullLibraryPath, {
        params,
        signal, // allows React Query to cancel request
      });
      return data;
    },
  });
}
