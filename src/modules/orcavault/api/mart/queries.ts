import { useQuery } from '@tanstack/react-query';
import { execute } from '../graphql/utils';
import { ALL_LIMS_QUERY } from '../graphql/queries/allLims';
import {
  BamFilter,
  BamsOrderBy,
  FastqFilter,
  FastqsOrderBy,
  LimFilter,
  LimsOrderBy,
  WorkflowFilter,
  WorkflowsOrderBy,
} from '../graphql/codegen/graphql';
import { Filter } from '../../components/utils';
import { ALL_BAMS_QUERY } from '../graphql/queries/allBams';
import { ALL_FASTQS_QUERY } from '../graphql/queries/allFastqs';
import { ALL_WORKFLOWS_QUERY } from '../graphql/queries/allWorkflows';

interface UseFilterParams<TFilter, TOrderBy> {
  first?: number;
  offset?: number;
  orderBy?: TOrderBy;
  filter?: TFilter;
}

export type GraphQLFilterProps = {
  filterOp: 'and' | 'or';
  filters: Filter[];
};

export function buildGraphQLFilter<TFilter>({ filterOp, filters }: GraphQLFilterProps): TFilter {
  return {
    [filterOp]: filters.map((f) => ({
      [f.key]: {
        [f.operator]: f.value,
      },
    })),
  } as TFilter;
}

export const useAllLims = (params: UseFilterParams<LimFilter, LimsOrderBy>) => {
  return useQuery({
    queryKey: ['allLims', params],
    queryFn: async () => {
      try {
        const data = await execute(ALL_LIMS_QUERY, {
          first: params.first,
          offset: params.offset,
          orderBy: params.orderBy,
          filter: params.filter,
        });
        return data;
      } catch (error) {
        console.error('error', error);
        throw error;
      }
    },
  });
};

export const useAllBams = (params: UseFilterParams<BamFilter, BamsOrderBy>) => {
  return useQuery({
    queryKey: ['allBams', params],
    queryFn: async () => {
      try {
        const data = await execute(ALL_BAMS_QUERY, {
          first: params.first,
          offset: params.offset,
          orderBy: params.orderBy,
          filter: params.filter,
        });
        return data;
      } catch (error) {
        console.error('error', error);
        throw error;
      }
    },
  });
};

export const useAllFastqs = (params: UseFilterParams<FastqFilter, FastqsOrderBy>) => {
  return useQuery({
    queryKey: ['allFastqs', params],
    queryFn: async () => {
      try {
        const data = await execute(ALL_FASTQS_QUERY, {
          first: params.first,
          offset: params.offset,
          orderBy: params.orderBy,
          filter: params.filter,
        });
        return data;
      } catch (error) {
        console.error('error', error);
        throw error;
      }
    },
  });
};

export const useAllWorkflows = (params: UseFilterParams<WorkflowFilter, WorkflowsOrderBy>) => {
  return useQuery({
    queryKey: ['allWorkflows', params],
    queryFn: async () => {
      try {
        const data = await execute(ALL_WORKFLOWS_QUERY, {
          first: params.first,
          offset: params.offset,
          orderBy: params.orderBy,
          filter: params.filter,
        });
        return data;
      } catch (error) {
        console.error('error', error);
        throw error;
      }
    },
  });
};
