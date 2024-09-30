import React from 'react';
import { LibraryListQueryParams, useMetadataLibraryModel } from '@/api/metadata';
import { useQueryParams } from '@/hooks/useQueryParams';
import { components } from '@/api/types/metadata';
import { Column, Table } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { Link } from 'react-router-dom';
import { getCurrentSortDirection, getSetSortValue } from '@/components/tables/Table';
import { LibraryTableFilter } from '@/modules/lab/components/library/LibraryTableFilter';
import { Search } from '@/components/common/search';

export const LibraryListAPITable = ({ queryParams }: { queryParams: LibraryListQueryParams }) => {
  const { setQueryParams, getPaginationParams } = useQueryParams();

  const fullLibraryModel = useMetadataLibraryModel({
    params: { query: { ...queryParams, ...getPaginationParams() } },
  });

  const data = fullLibraryModel.data;
  if (!data) {
    throw new Error('No subject data found!');
  }

  const flatData = processLibraryResults(data.results);
  const pagination = data.pagination;
  return (
    <Table
      tableHeader={
        <div className='flex flex-col md:flex-row'>
          <div className='flex items-center justify-center'>{'Library Table'}</div>
          <div className='flex flex-1 items-center justify-end pt-2'>
            <Search setQueryParams={setQueryParams} />
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
    const rec: Record<string, null | string> = {
      // Library Model
      libraryId: '-',
      phenotype: '-',
      workflow: '-',
      quality: '-',
      type: '-',
      assay: '-',
      coverage: '-',

      // Sample Model
      sampleId: '-',
      externalSampleId: '-',
      source: '-',

      // Subject Model
      subjectId: '-',
    };

    rec.libraryId = library.libraryId ?? '-';
    rec.phenotype = library.phenotype ?? '-';
    rec.workflow = library.workflow ?? '-';
    rec.quality = library.quality ?? '-';
    rec.type = library.type ?? '-';
    rec.assay = library.assay ?? '-';
    rec.coverage = library.coverage?.toString() ?? '-';

    const sample = library.sample;
    rec.sampleId = sample.sampleId ?? '-';
    rec.externalSampleId = sample.externalSampleId ?? '-';
    rec.source = sample.source ?? '-';

    const subject = library.subject;
    rec.subjectId = subject.subjectId ?? '-';

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
    accessor: 'libraryId',
    onSort: setSort
      ? () => {
          setSort(getSetSortValue(currentSort, 'library_id'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'library_id'),
    cell: (p: unknown) => {
      const libId = p as string[];
      return (
        <Link
          to={`/lab/library/${libId}`}
          className={classNames(
            'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
          )}
        >
          {libId}
        </Link>
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
      accessor: 'sampleId',
      headerClassName: cellColor.headerClassName,
      cellClassName: cellColor.cellClassName,
    },
    {
      header: 'ExternalSampleId',
      accessor: 'externalSampleId',
      headerClassName: cellColor.headerClassName,
      cellClassName: cellColor.cellClassName,
    },
    {
      header: 'Source',
      accessor: 'source',
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
      header: 'Subject Id',
      headerClassName: cellColor.headerClassName,
      accessor: 'subjectId',
      cell: (data: unknown) => {
        const subjectId = data as string[];
        return (
          <Link
            to={`/lab/subject/${subjectId}`}
            className={classNames(
              'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
            )}
          >
            {subjectId}
          </Link>
        );
      },
      cellClassName: cellColor.cellClassName,
    },
  ];
};
