import config from '@/config';
import createClient from 'openapi-fetch';
import type { paths } from './types/metadata';
import { useSuspenseQuery } from '@tanstack/react-query';
import { authMiddleware, UseSuspenseQueryOptions } from './utils';

const client = createClient<paths>({ baseUrl: config.apiEndpoint.metadata });
client.use(authMiddleware);

const metadataFullSubjectPath = '/api/v1/subject/full/';
export function useMetadataFullSubjectModel({
  params,
  reactQuery,
}: UseSuspenseQueryOptions<paths[typeof metadataFullSubjectPath]['get']>) {
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

const metadataFullLibraryPath = '/api/v1/library/full/';
export function useMetadataFullLibraryModel({
  params,
  reactQuery,
}: UseSuspenseQueryOptions<paths[typeof metadataFullLibraryPath]['get']>) {
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
