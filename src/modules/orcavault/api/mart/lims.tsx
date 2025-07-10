import { useQuery } from '@tanstack/react-query';
import { execute } from '../graphql/utils';
import { ALL_LIMS_QUERY } from '../graphql/queries/allLims';
import { LimFilter, LimsOrderBy } from '../graphql/codegen/graphql';
import { Filter } from '../../components/utils';

interface UseAllLimsParams {
  first?: number;
  offset?: number;
  orderBy?: LimsOrderBy;
  filter?: LimFilter;
}

export const useAllLims = (limsParams: UseAllLimsParams) => {
  return useQuery({
    queryKey: ['allLims', limsParams],
    queryFn: async () => {
      try {
        const data = await execute(ALL_LIMS_QUERY, {
          first: limsParams.first,
          offset: limsParams.offset,
          orderBy: limsParams.orderBy,
          filter: limsParams.filter,
        });
        return data;
      } catch (error) {
        console.error('error', error);
        throw error;
      }
    },
  });
};

export function buildGraphQLFilter(filters: Filter[]) {
  return {
    and: filters.map((f) => ({
      [f.key]: {
        [f.operator]: f.value,
      },
    })),
  };
}
