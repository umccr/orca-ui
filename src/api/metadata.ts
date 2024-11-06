import config from '@/config';
import createClient from 'openapi-fetch';
import type { paths, components, operations } from './types/metadata';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { authMiddleware, UseSuspenseQueryOptions, UseMutationOptions, PathsWithGet } from './utils';

const client = createClient<paths>({ baseUrl: config.apiEndpoint.metadata });
client.use(authMiddleware);

type GetPaths = PathsWithGet<paths>;

function createMetadataFetchingHook<K extends GetPaths>(path: K) {
  return function ({ params, reactQuery }: UseSuspenseQueryOptions<paths[K]['get']>) {
    return useSuspenseQuery({
      ...reactQuery,
      queryKey: [path, params],
      queryFn: async ({ signal }) => {
        const { data, error, response } =
          // @ts-expect-error: params is dynamic type type for openapi-fetch
          await client.GET(path, { params, signal });

        if (error) {
          if (typeof error === 'object') {
            throw new Error(JSON.stringify(error));
          }
          throw new Error(response.statusText);
        }

        return data;
      },
    });
  };
}

export function createMetadataPostHook<K extends keyof paths>(path: K) {
  return function ({ params, reactQuery, body }: UseMutationOptions<paths[typeof path]['post']>) {
    return useMutation({
      ...reactQuery,
      mutationFn: async () => {
        const { data, error, response }: { data?: string; error?: undefined; response: Response } =
          // @ts-expect-error: params is dynamic type type for openapi-fetch
          await client.POST(path, { params, body: body });
        if (error) {
          if (typeof error === 'object') {
            throw new Error(JSON.stringify(error));
          }
          throw new Error(response.statusText);
        }

        return data;
      },
    });
  };
}

export type PhenotypeEnum = components['schemas']['PhenotypeEnum'];
export type QualityEnum = components['schemas']['QualityEnum'];
export type TypeEnum = components['schemas']['TypeEnum'];
export type WorkflowEnum = components['schemas']['WorkflowEnum'];

export type LibraryListQueryParams = operations['libraryList']['parameters']['query'];
export type SubjectListQueryParams = operations['subjectList']['parameters']['query'];
export type IndividualListQueryParams = operations['individualList']['parameters']['query'];
export type SampleListQueryParams = operations['sampleList']['parameters']['query'];
export type ContactListQueryParams = operations['contactList']['parameters']['query'];
export type ProjectListQueryParams = operations['projectList']['parameters']['query'];

export const useSuspenseMetadataSubjectModel = createMetadataFetchingHook('/api/v1/subject/');
export const useSuspenseMetadataLibraryModel = createMetadataFetchingHook('/api/v1/library/');
export const useSuspenseMetadataDetailLibraryModel = createMetadataFetchingHook(
  '/api/v1/library/{orcabusId}/'
);
export const useSuspenseMetadataDetailLibraryHistoryModel = createMetadataFetchingHook(
  '/api/v1/library/{orcabusId}/history/'
);
export const useSuspenseMetadataIndividualModel = createMetadataFetchingHook('/api/v1/individual/');
export const useSuspenseMetadataSampleModel = createMetadataFetchingHook('/api/v1/sample/');
export const useSuspenseMetadataContactModel = createMetadataFetchingHook('/api/v1/contact/');
export const useSuspenseMetadataProjectModel = createMetadataFetchingHook('/api/v1/project/');

// UseMutation
export const useMutationSyncGsheet = createMetadataPostHook('/api/v1/sync/gsheet/');
export const useMutationSyncCustomCsv = createMetadataPostHook('/api/v1/sync/presigned-csv/');
