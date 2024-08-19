import config from '@/config';
import createClient, { ParamsOption, RequestBodyOption } from 'openapi-fetch';
import type { paths } from './types/file';
import { useSuspenseQuery } from '@tanstack/react-query';
import { authMiddleware } from './utils';

const client = createClient<paths>({ baseUrl: config.apiEndpoint.file });
client.use(authMiddleware);

type UseQueryOptions<T> = ParamsOption<T> &
  RequestBodyOption<T> & {
    // add your custom options here
    reactQuery?: {
      // Note: React Query type’s inference is difficult to apply automatically, hence manual option passing here
      // add other React Query options as needed
    };
  };

const s3Path = '/api/v1/s3';
export type S3Record =
  paths[typeof s3Path]['get']['responses']['200']['content']['application/json']['results'][number];
export function useFileObject({
  params,
  reactQuery,
}: UseQueryOptions<paths[typeof s3Path]['get']>) {
  return useSuspenseQuery({
    ...reactQuery,
    queryKey: ['GET', s3Path, params],
    queryFn: async ({ signal }) => {
      const { data } = await client.GET(s3Path, {
        params,
        signal, // allows React Query to cancel request
      });
      return data;
    },
  });
}

const s3PresignObjIdPath = '/api/v1/s3/presign/{id}';
export function usePresignedFileObjectId({
  params,
  reactQuery,
}: UseQueryOptions<paths[typeof s3PresignObjIdPath]['get']>) {
  return useSuspenseQuery({
    ...reactQuery,
    queryKey: ['GET', s3PresignObjIdPath, params],
    queryFn: async ({ signal }) => {
      const { data } = await client.GET(s3PresignObjIdPath, {
        params,
        signal, // allows React Query to cancel request
      });
      return data;
    },
  });
}

const s3PresignIdListPath = '/api/v1/s3/presign';
export function usePresignedFileList({
  params,
  reactQuery,
}: UseQueryOptions<paths[typeof s3PresignIdListPath]['get']>) {
  return useSuspenseQuery({
    ...reactQuery,
    queryKey: ['GET', s3PresignIdListPath, params],
    queryFn: async ({ signal }) => {
      const { data } = await client.GET(s3PresignIdListPath, {
        params,
        signal, // allows React Query to cancel request
      });
      return data;
    },
  });
}
