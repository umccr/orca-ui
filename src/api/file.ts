import config from '@/config';
import createClient from 'openapi-fetch';
import type { paths } from './types/file';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { authMiddleware, UseSuspenseQueryOptions } from './utils';

const client = createClient<paths>({
  baseUrl: config.apiEndpoint.file,
});
client.use(authMiddleware);

type UseQueryOptions<T> = UseSuspenseQueryOptions<T> & {
  reactQuery?: {
    enabled?: boolean;
  };
};

const s3Path = '/api/v1/s3';
export type S3Record =
  paths[typeof s3Path]['get']['responses']['200']['content']['application/json']['results'][number];
export function useFileObject({
  params,
  reactQuery,
}: UseSuspenseQueryOptions<paths[typeof s3Path]['get']>) {
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
  headers,
}: UseSuspenseQueryOptions<paths[typeof s3PresignObjIdPath]['get']>) {
  return useSuspenseQuery({
    ...reactQuery,
    queryKey: ['GET', s3PresignObjIdPath, params],
    queryFn: async ({ signal }) => {
      const { data } = await client.GET(s3PresignObjIdPath, {
        params,
        signal, // allows React Query to cancel request
        headers: {
          ...headers,
        },
      });

      return data;
    },
    staleTime: 300,
  });
}

export function useQueryPresignedFileObjectId({
  params,
  reactQuery,
}: UseQueryOptions<paths[typeof s3PresignObjIdPath]['get']>) {
  return useQuery({
    ...reactQuery,
    queryKey: ['GET', s3PresignObjIdPath, params],
    queryFn: async ({ signal }) => {
      const { data } = await client.GET(s3PresignObjIdPath, {
        params,
        signal, // allows React Query to cancel request
      });

      return data;
    },
    staleTime: 300,
  });
}

const s3PresignIdListPath = '/api/v1/s3/presign';
export function usePresignedFileList({
  params,
  reactQuery,
}: UseSuspenseQueryOptions<paths[typeof s3PresignIdListPath]['get']>) {
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
    staleTime: 300,
  });
}

export function useQueryPresignedFileList({
  params,
  reactQuery,
}: UseQueryOptions<paths[typeof s3PresignIdListPath]['get']>) {
  return useQuery({
    ...reactQuery,
    queryKey: ['GET', s3PresignIdListPath, params],
    queryFn: async ({ signal }) => {
      const { data } = await client.GET(s3PresignIdListPath, {
        params,
        signal, // allows React Query to cancel request
      });
      return data;
    },
    staleTime: 300,
  });
}
