import config from '@/config';
import createClient from 'openapi-fetch';
import type { paths } from './types/metadata';
import { useSuspenseQuery } from '@tanstack/react-query';
import { authMiddleware, UseSuspenseQueryOptions } from './utils';

const client = createClient<paths>({ baseUrl: config.apiEndpoint.metadata });
client.use(authMiddleware);

function createMetadataFetchingHook<K extends keyof paths>(path: K) {
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


export const useMetadataFullSubjectModel = createMetadataFetchingHook('/api/v1/subject/full/');
export const useMetadataFullLibraryModel = createMetadataFetchingHook('/api/v1/library/full/');
