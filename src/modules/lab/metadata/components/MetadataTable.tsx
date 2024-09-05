import { components } from '@/api/types/metadata';
import { Table } from '@/components/tables';
import { Column } from '@/components/tables/Table';
import { classNames } from '@/utils/commonUtils';
import { Link } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';
import { useQueryParams } from '@/hooks/useQueryParams';
import { MetadataFilterDropdown } from './MetadataFilterDropdown';

type MetadataTableProps = {
  data: Record<string, unknown>[];
  metadataApiUsed: 'subject' | 'library';
  pagination:
    | components['schemas']['PaginatedSubjectFullList']['pagination']
    | components['schemas']['PaginatedLibraryFullList']['pagination'];
};

export const MetadataTable = ({ data, pagination, metadataApiUsed }: MetadataTableProps) => {
  const { setQueryParams, getQueryParams, clearQueryParams } = useQueryParams();

  const queryParam = getQueryParams();

  return (
    <Table
      tableHeader={
        <div className='flex flex-col md:flex-row'>
          <div className='flex items-center justify-center'>{'Metadata Table'}</div>
          <div className='flex flex-1 items-center justify-end pt-2'>
            <MetadataFilterDropdown />
          </div>
        </div>
      }
      columns={[
        ...getSubjectColumn({
          setSort:
            metadataApiUsed === 'subject'
              ? (newOrder: string) => {
                  clearQueryParams();
                  setQueryParams({ ordering: newOrder });
                }
              : undefined,
          currentSort: queryParam['ordering'],
        }),
        ...getSpecimenColumn(),
        ...getLibraryColumn({
          setSort:
            metadataApiUsed === 'library'
              ? (newOrder: string) => {
                  setQueryParams({ ordering: newOrder });
                }
              : undefined,
          currentSort: queryParam['ordering'],
        }),
      ]}
      tableData={data}
      paginationProps={{
        totalCount: pagination.count ?? 0,
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
  );
};

/**
 * Table Columns Properties
 */

const getCurrentSortDirection = (currentSort: string | undefined, key: string) => {
  if (!currentSort || !currentSort.endsWith(key)) {
    return undefined;
  }

  if (currentSort?.startsWith('-')) {
    return 'desc';
  }

  return 'asc';
};

const getSetSortValue = (currentSort: string | undefined, key: string) => {
  const currentSortDirection = getCurrentSortDirection(currentSort, key);

  // Going the opposite here from the current sort direction
  return `${currentSortDirection === 'desc' ? '' : '-'}${key}`;
};

const getSubjectColumn = ({
  setSort,
  currentSort,
}: {
  setSort?: (newOrder: string) => void;
  currentSort?: string;
}): Column[] => [
  {
    header: 'SubjectId',
    accessor: 'subjectId',
    onSort: setSort
      ? () => {
          setSort(getSetSortValue(currentSort, 'subject_id'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'subject_id'),
    cell: (data: unknown) => {
      const { subjectId } = data as Record<string, string>;

      if (!subjectId) {
        return <div>-</div>;
      }

      return (
        <Link
          to={`subject/${subjectId}`}
          className={classNames(
            'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
          )}
        >
          {subjectId}
        </Link>
      );
    },
  },
];

const multiRowCel = (p: unknown) => {
  const data = p as string[];
  return (
    <Fragment>
      {data.map((item, idx) => (
        <div className='py-2' key={idx}>
          {item}
        </div>
      ))}
    </Fragment>
  );
};

const getSpecimenColumn = (): Column[] => [
  {
    header: 'SpecimenId',
    accessor: 'specimenId',
    cell: multiRowCel,
  },
  {
    header: 'Source',
    accessor: 'source',
    cell: multiRowCel,
  },
];

const getLibraryColumn = ({
  setSort,
  currentSort,
}: {
  setSort?: (newOrder: string) => void;
  currentSort?: string;
}): Column[] => [
  {
    header: 'LibraryId',
    accessor: 'libraryId',
    onSort: setSort
      ? () => {
          setSort(getSetSortValue(currentSort, 'library_id'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'library_id'),
    cell: (p: unknown) => {
      const data = p as string[];
      return (
        <Fragment>
          {data.map((libId, idx) => {
            if (!libId) {
              return <div key={idx}>-</div>;
            }
            return (
              <div className='py-2' key={idx}>
                <Link
                  to={`library/${libId}`}
                  className={classNames(
                    'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                  )}
                >
                  {libId}
                </Link>
              </div>
            );
          })}
        </Fragment>
      );
    },
  },
  {
    header: 'Phenotype',
    accessor: 'phenotype',
    onSort: setSort
      ? () => {
          setSort(getSetSortValue(currentSort, 'phenotype '));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'phenotype'),
    cell: multiRowCel,
  },
  {
    header: 'Workflow',
    accessor: 'workflow',
    onSort: setSort
      ? () => {
          setSort(getSetSortValue(currentSort, 'workflow'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'workflow'),
    cell: multiRowCel,
  },
  {
    header: 'Quality',
    accessor: 'quality',
    onSort: setSort
      ? () => {
          setSort(getSetSortValue(currentSort, 'quality'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'quality'),
    cell: multiRowCel,
  },
  {
    header: 'Type',
    accessor: 'type',
    onSort: setSort
      ? () => {
          setSort(getSetSortValue(currentSort, 'type'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'type'),
    cell: multiRowCel,
  },
  {
    header: 'Assay',
    accessor: 'assay',
    onSort: setSort
      ? () => {
          setSort(getSetSortValue(currentSort, 'assay'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'assay'),
    cell: multiRowCel,
  },
  {
    header: 'Coverage',
    accessor: 'coverage',
    onSort: setSort
      ? () => {
          setSort(getSetSortValue(currentSort, 'coverage'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'coverage'),
    cell: multiRowCel,
  },
];
