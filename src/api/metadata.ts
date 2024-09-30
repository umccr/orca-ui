import config from '@/config';
import createClient from 'openapi-fetch';
import type { paths, components, operations } from './types/metadata';
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
export type PhenotypeEnum = components['schemas']['PhenotypeEnum'];
export type QualityEnum = components['schemas']['QualityEnum'];
export type TypeEnum = components['schemas']['TypeEnum'];
export type WorkflowEnum = components['schemas']['WorkflowEnum'];

export type LibraryListQueryParams = operations['apiV1LibraryList']['parameters']['query'];
export type SubjectListQueryParams = operations['apiV1SubjectList']['parameters']['query'];

export const useMetadataSubjectModel = createMetadataFetchingHook('/api/v1/subject/');
export const useMetadataLibraryModel = createMetadataFetchingHook('/api/v1/library/');
