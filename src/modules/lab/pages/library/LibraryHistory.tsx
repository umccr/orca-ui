import { useParams } from 'react-router-dom';
import { useQueryMetadataDetailLibraryHistoryModel } from '@/api/metadata';
import { Column, Table } from '@/components/tables';
import { useQueryParams } from '@/hooks/useQueryParams';
import { multiRowCell } from '@/components/tables/Table';

export default function LibraryOverviewPage() {
  const { libraryOrcabusId } = useParams();
  if (!libraryOrcabusId) {
    throw new Error('No library id in URL path!');
  }

  const { setQueryParams, getPaginationParams } = useQueryParams();

  const libraryHistory = useQueryMetadataDetailLibraryHistoryModel({
    params: {
      path: {
        orcabusId: libraryOrcabusId,
      },
      query: getPaginationParams(),
    },
  });

  const libraryHistoryData = libraryHistory?.data;

  const pagination = libraryHistoryData?.pagination;

  // Extract columns dynamically from the first result
  const columns: Column[] =
    !!libraryHistoryData && libraryHistoryData.results.length > 0
      ? Object.keys(libraryHistoryData.results[0]).map((key) => ({
          header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter
          accessor: key,
          cell: multiRowCell,
        }))
      : [];

  return (
    <div className=''>
      <Table
        isFetchingData={libraryHistory.isFetching}
        inCard={true}
        tableHeader={'Library History'}
        columns={columns}
        tableData={libraryHistoryData ? libraryHistoryData.results : []}
        paginationProps={{
          totalCount: pagination?.count ?? 0,
          rowsPerPage: pagination?.rowsPerPage ?? 0,
          currentPage: pagination?.page ?? 0,
          setPage: (n: number) => {
            setQueryParams({ page: n });
          },
          setRowsPerPage: (n: number) => {
            setQueryParams({ rowsPerPage: n });
          },
        }}
      />
    </div>
  );
}
