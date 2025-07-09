import { Table } from '@/components/tables';
import { useQueryParams } from '@/hooks/useQueryParams';
import { getCurrentSortDirection, getSortValue } from '@/components/tables/Table';
import { SpinnerWithText } from '@/components/common/spinner';
import { useAllLims } from '../../api/mart/lims';
import { LimFilter, LimsOrderBy } from '../../api/graphql/codegen/graphql';
import { FIELD_LABEL } from '../../api/graphql/queries/allLims';

export const LimsTable = () => {
  const { setQueryParams, getPaginationParams, getQueryParams } = useQueryParams();
  const queryParams = getQueryParams();

  const currentQueryFilter = queryParams.filter;
  const filter = currentQueryFilter ? (JSON.parse(currentQueryFilter) as LimFilter) : undefined;

  const currentSort = queryParams?.ordering;
  const currentSortType = LimsOrderBy[currentSort as keyof typeof LimsOrderBy];

  const pagination = getPaginationParams();
  const offset = (pagination.page - 1) * pagination.rowsPerPage;

  const libraryModel = useAllLims({
    filter: filter,
    first: pagination.rowsPerPage,
    offset: offset,
    orderBy: currentSort ? currentSortType : LimsOrderBy.SequencingRunDateDesc,
  });

  if (libraryModel.isLoading) {
    return (
      <div>
        <SpinnerWithText text='fetching LIMS records' />
      </div>
    );
  }

  const data = libraryModel.data?.allLims;
  if (!data) {
    throw new Error('Error: unable to retrieve results!');
  }

  return (
    <>
      <Table
        inCard={false}
        columns={FIELD_LABEL.map((field) => ({
          header: field.label,
          accessor: field.key,
          onSort: () => {
            setQueryParams({ ordering: getSortValue(currentSort, field.key) });
          },
          sortDirection: getCurrentSortDirection(currentSort, field.key),
        }))}
        tableData={data.nodes}
        paginationProps={{
          totalCount: data.totalCount,
          rowsPerPage: pagination.rowsPerPage ?? 0,
          currentPage: pagination.page ?? 0,
          setPage: (n: number) => {
            setQueryParams({ page: n });
          },
          setRowsPerPage: (n: number) => {
            setQueryParams({ rowsPerPage: n });
          },
        }}
      />
    </>
  );
};
