import config from '@/config';
import createClient from 'openapi-fetch';
import type { paths } from './types/metadata';
import { useSuspenseQuery } from '@tanstack/react-query';
import { authMiddleware, UseSuspenseQueryOptions } from './utils';

const client = createClient<paths>({ baseUrl: config.apiEndpoint.metadata });
client.use(authMiddleware);
function createMeatdataFetchingHook<K extends keyof paths>(path: K) {
  return function ({ params, reactQuery }: UseSuspenseQueryOptions<paths[typeof path]['get']>) {
    return useSuspenseQuery({
      ...reactQuery,
      queryKey: [path, params],
      queryFn: async ({ signal }) => {
        const { data } = await client.GET(path, {
          params,
          signal,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
        return data;
      },
    });
  };
}

export const useMetadataFullSubjectModel = createMeatdataFetchingHook('/api/v1/subject/full/');
export const useMetadataFullLibraryModel = createMeatdataFetchingHook('/api/v1/library/full/');
