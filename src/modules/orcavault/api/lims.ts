import { gql, useQuery } from '@apollo/client';

export type Lims = {
  load_datetime: string;
  sequencing_run_date: string; // You can adjust this to a Date type if needed
  sequencing_run_id: string;
  library_id: string;
  internal_subject_id: string;
  external_subject_id: string;
  sample_id: string;
  external_sample_id: string;
  experiment_id: string;
  project_id: string;
  owner_id: string;
  workflow: string;
  phenotype: string;
  type: string;
  assay: string;
  quality: string;
  source: string;
  truseq_index: string;
};

type GraphqlQueryParams = {
  selectedFields: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter?: Record<string, any>;
  limit?: number;
  offset?: number;
  orderBy?: Record<string, 'ASC' | 'DESC'>[];
};

export function useMartListLimsQuery({
  selectedFields,
  filter = {},
  limit = 25,
  offset = 0,
  orderBy = [],
}: GraphqlQueryParams) {
  const queryName = `listLims`;
  const fields = selectedFields.join('\n');

  const query = gql`
    query ListLims(
      $filter: TableLimsFilterInput
      $limit: Int
      $offset: Int
      $orderBy: [OrderByLimsInput]
    ) {
      ${queryName}(filter: $filter, limit: $limit, offset: $offset, orderBy: $orderBy) {
        items {
          ${fields}
        }
        totalCount
      }
    }
  `;

  const { data, loading, error } = useQuery<{
    [key: string]: { items: Lims[]; totalCount: number };
  }>(query, { variables: { filter, limit, offset, orderBy }, skip: selectedFields.length === 0 });

  return { data: data?.[queryName], loading, error };
}
