import config from '@/config';
import createClient from 'openapi-fetch';
import type { paths } from './types/case';
import { useSuspenseQuery } from '@tanstack/react-query';
import { authMiddleware, UseSuspenseQueryOptions } from './utils';

const client = createClient<paths>({
  baseUrl: config.apiEndpoint.case,
});
client.use(authMiddleware);

const casePath = '/api/v1/case/';
export function useQueryCaseListObject({
  params,
  reactQuery,
}: UseSuspenseQueryOptions<paths[typeof casePath]['get']>) {
  return useSuspenseQuery({
    ...reactQuery,
    queryKey: ['GET', casePath, params],
    queryFn: async ({ signal }) => {
      const { data, error, response } = await client.GET(casePath, {
        params,
        signal, // allows React Query to cancel request
      });
      if (error) {
        if (typeof error === 'object') {
          throw new Error(JSON.stringify(error));
        }
        throw new Error((response as Response).statusText);
      }

      return data;
    },
  });
}

const caseDetailPath = '/api/v1/case/{orcabusId}/';
export function useQueryCaseDetailObject({
  params,
  reactQuery,
}: UseSuspenseQueryOptions<paths[typeof caseDetailPath]['get']>) {
  return useSuspenseQuery({
    ...reactQuery,
    queryKey: ['GET', caseDetailPath, params],
    queryFn: async ({ signal }) => {
      const { data, error, response } = await client.GET(caseDetailPath, {
        // @ts-expect-error: params is dynamic type type for openapi-fetch
        params,
        signal, // allows React Query to cancel request
      });
      if (error) {
        if (typeof error === 'object') {
          throw new Error(JSON.stringify(error));
        }
        throw new Error((response as Response).statusText);
      }

      return data;
    },
  });
}
