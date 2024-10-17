import React from 'react';
import { LibraryListQueryParams, useSuspenseMetadataLibraryModel } from '@/api/metadata';
import { useQueryParams } from '@/hooks/useQueryParams';
import { components } from '@/api/types/metadata';
import { Column, Table } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { Link } from 'react-router-dom';
import { getCurrentSortDirection, getSortValue } from '@/components/tables/Table';
import { LibraryTableFilter } from '@/modules/lab/components/library/LibraryTableFilter';
import { Search } from '@/components/common/search';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/common/tooltips';

export const LibraryListAPITable = ({ queryParams }: { queryParams: LibraryListQueryParams }) => {
  const { setQueryParams, getPaginationParams } = useQueryParams();

  const libraryModel = useSuspenseMetadataLibraryModel({
    params: { query: { ...queryParams, ...getPaginationParams() } },
  });

  const data = libraryModel.data;
  if (!data) {
    throw new Error('No subject data found!');
  }

  const flatData = processLibraryResults(data.results);
  const pagination = data.pagination;
  return (
    <Table
      inCard={false}
      tableHeader={
        <div className='flex flex-col'>
          <div className='flex items-center justify-center'>{'Library Table'}</div>
          <div className='flex flex-1 items-center justify-end pt-2'>
            <Search onSearch={(s) => setQueryParams({ search: s })} />
            <div className='ml-2'>
              <LibraryTableFilter />
            </div>
          </div>
        </div>
      }
      columns={[
        ...getLibraryTableColumn({
          setSort: (newOrder: string) => {
            setQueryParams({ ordering: newOrder });
          },
          currentSort: queryParams?.ordering,
        }),
        ...getSubjectColumn(),
        ...getSampleColumn(),
        ...getProjectColumn(),
      ]}
      tableData={flatData}
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
 * Process library results record to a flat array of json. Unpack sample and subject from nested
 * JSON object
 * @param data the results returned from the API
 * @returns
 */
const processLibraryResults = (data: components['schemas']['LibraryDetail'][]) => {
  return data.map((library) => {
    const rec: Record<string, unknown> = {
      // Library Model
      libraryIds: {
        orcabusId: library.orcabusId,
        libraryId: library.libraryId,
      },
      libraryId: library.libraryId ?? '-',
      phenotype: library.phenotype ?? '-',
      workflow: library.workflow ?? '-',
      quality: library.quality ?? '-',
      type: library.type ?? '-',
      assay: library.assay ?? '-',
      coverage: library.coverage?.toString() ?? '-',

      // Sample Model
      sampleIds: {
        orcabusId: library.sample.orcabusId,
        sampleId: library.sample.sampleId,
      },
      sampleExternalId: library.sample.externalSampleId ?? '-',
      sampleSource: library.sample.source ?? '-',

      // Subject Model
      subjectIds: {
        orcabusId: library.subject.orcabusId,
        subjectId: library.subject.subjectId,
      },

      // Project Model
      projectIds: library.projectSet.map((project) => ({
        orcabusId: project.orcabusId,
        projectId: project.projectId,
      })),
    };

    return rec;
  });
};

/**
 * Table Columns Properties
 */

// Exported as it might be useful for other components when rendering the Library Table
export const getLibraryTableColumn = ({
  setSort,
  currentSort,
}: {
  setSort?: (newOrder: string) => void;
  currentSort?: string;
}): Column[] => [
  {
    header: 'Library Id',
    headerGroup: { colSpan: 7 },
    accessor: 'libraryIds',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'library_id'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'library_id'),
    cell: (p: unknown) => {
      const ids = p as { orcabusId: string; libraryId: string };
      return (
        <Link
          to={`/lab/library/${ids.orcabusId}/overview`}
          className={classNames(
            'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
          )}
        >
          {ids.libraryId}
        </Link>
      );
    },
  },
  {
    header: 'Phenotype',
    accessor: 'phenotype',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'phenotype '));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'phenotype'),
  },
  {
    header: 'Workflow',
    accessor: 'workflow',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'workflow'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'workflow'),
  },
  {
    header: 'Quality',
    accessor: 'quality',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'quality'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'quality'),
  },
  {
    header: 'Type',
    accessor: 'type',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'type'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'type'),
  },
  {
    header: 'Assay',
    accessor: 'assay',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'assay'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'assay'),
  },
  {
    header: 'Coverage',
    accessor: 'coverage',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'coverage'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'coverage'),
  },
];

const getSampleColumn = (): Column[] => {
  const cellColor = {
    headerClassName: 'bg-red-100',
    cellClassName: 'bg-red-50',
  };
  return [
    {
      header: 'Sample Id',
      headerGroup: { label: 'Sample', colSpan: 3, additionalClassName: cellColor.headerClassName },
      accessor: 'sampleIds',
      headerClassName: cellColor.headerClassName,
      cell: (data: unknown) => {
        const ids = data as { orcabusId: string; sampleId: string };
        return (
          <Link
            to={`/lab/?tab=sample&orcabusId=${ids.orcabusId}`}
            className={classNames(
              'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
            )}
          >
            {ids.sampleId ?? '-'}
          </Link>
        );
      },
      cellClassName: cellColor.cellClassName,
    },
    {
      header: 'External Sample Id',
      accessor: 'sampleExternalId',
      headerClassName: cellColor.headerClassName,
      cellClassName: cellColor.cellClassName,
    },
    {
      header: 'Source',
      accessor: 'sampleSource',
      headerClassName: cellColor.headerClassName,
      cellClassName: cellColor.cellClassName,
    },
  ];
};

const getSubjectColumn = (): Column[] => {
  const cellColor = {
    headerClassName: 'bg-orange-100',
    cellClassName: 'bg-orange-50',
  };

  return [
    {
      header: (
        <div className='flex flex-row items-center'>
          <div>Subject Id</div>
          <Tooltip
            text={`This is now the 'ExternalSubjectID' from the tracking sheet`}
            position='top'
          >
            <InformationCircleIcon className='h-4	ml-2' />
          </Tooltip>
        </div>
      ),
      headerClassName: cellColor.headerClassName,
      headerGroup: { label: 'Subject', colSpan: 1, additionalClassName: cellColor.headerClassName },
      accessor: 'subjectIds',
      cell: (data: unknown) => {
        const subjectIds = data as { orcabusId: string; subjectId: string };
        return (
          <Link
            to={`/lab/?tab=subject&orcabusId=${subjectIds.orcabusId}`}
            className={classNames(
              'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
            )}
          >
            {subjectIds.subjectId ?? '-'}
          </Link>
        );
      },
      cellClassName: cellColor.cellClassName,
    },
  ];
};

const getProjectColumn = (): Column[] => {
  const cellColor = {
    headerClassName: 'bg-indigo-100',
    cellClassName: 'bg-indigo-50',
  };

  return [
    {
      header: 'Project Id',
      headerClassName: cellColor.headerClassName,
      headerGroup: { label: 'Project', colSpan: 1, additionalClassName: cellColor.headerClassName },
      accessor: 'projectIds',
      cell: (p: unknown) => {
        const data = p as { projectId: string; orcabusId: string }[];
        return (
          <>
            {data.map((projectIds, idx) => {
              return (
                <div className='py-2' key={idx}>
                  {projectIds.projectId ?? '-'}
                  {/* 
                  <Link
                    to={`lab/?tab=project&orcabusId=${projectIds.orcabusId}`}
                    className={classNames(
                      'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                    )}
                  >
                    {projectIds.projectId ?? '-'}
                  </Link> */}
                </div>
              );
            })}
          </>
        );
      },
      cellClassName: cellColor.cellClassName,
    },
  ];
};
