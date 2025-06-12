import { useMartListLimsQuery } from '../../api/lims';
import { Table } from '@/components/tables';
import { useQueryParams } from '@/hooks/useQueryParams';
import { getCurrentSortDirection, getSortValue } from '@/components/tables/Table';
import { SpinnerWithText } from '@/components/common/spinner';
import { FieldDefinition } from '../GraphqlFilter';

export const LimsTable = ({ fieldDefinitions }: { fieldDefinitions: FieldDefinition[] }) => {
  const { setQueryParams, getPaginationParams, getQueryParams } = useQueryParams();
  const queryParams = getQueryParams();

  const currentQueryFilter = queryParams.filter;
  const filter = currentQueryFilter ? JSON.parse(currentQueryFilter) : {};

  const currentSort = queryParams?.ordering;
  const sortKey = currentSort?.startsWith('-') ? currentSort.slice(1) : currentSort;
  const sortDirection = currentSort?.startsWith('-') ? 'DESC' : 'ASC';

  const pagination = getPaginationParams();
  const offset = (pagination.page - 1) * pagination.rowsPerPage;

  const libraryModel = useMartListLimsQuery({
    selectedFields: fieldDefinitions.map((field) => field.key),
    filter: filter,
    limit: pagination.rowsPerPage,
    offset: offset,
    orderBy: sortKey ? [{ [sortKey]: sortDirection }] : [{ sequencing_run_date: 'DESC' }],
  });

  if (libraryModel.loading) {
    return (
      <div>
        <SpinnerWithText text='fetching LIMS records' />
      </div>
    );
  }

  const data = libraryModel.data;
  if (!data) {
    throw new Error('Error: unable to retrieve results!');
  }

  return (
    <>
      <Table
        inCard={false}
        columns={fieldDefinitions.map((field) => ({
          header: field.label,
          accessor: field.key,
          onSort: () => {
            setQueryParams({ ordering: getSortValue(currentSort, field.key) });
          },
          sortDirection: getCurrentSortDirection(currentSort, field.key),
        }))}
        tableData={data.items}
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
