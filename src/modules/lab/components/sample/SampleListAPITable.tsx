import React, { Fragment } from 'react';
import { SampleListQueryParams, useMetadataSampleModel } from '@/api/metadata';
import { useQueryParams } from '@/hooks/useQueryParams';
import { components } from '@/api/types/metadata';
import { Column, Table } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { Link } from 'react-router-dom';
import { getCurrentSortDirection, getSortValue, multiRowCell } from '@/components/tables/Table';
import { Search } from '@/components/common/search';
import { SampleTableFilter } from './SampleTableFilter';

export const SampleListAPITable = ({ queryParams }: { queryParams: SampleListQueryParams }) => {
  const { setQueryParams, getPaginationParams } = useQueryParams();

  const sampleModel = useMetadataSampleModel({
    params: { query: { ...queryParams, ...getPaginationParams() } },
  });

  const data = sampleModel.data;
  if (!data) {
    throw new Error('No individual data found!');
  }

  const flatData = processDataResults(data.results);
  const pagination = data.pagination;
  return (
    <Table
      inCard={false}
      tableHeader={
        <div className='flex flex-col md:flex-row'>
          <div className='flex items-center justify-center'>{'Sample Table'}</div>
          <div className='flex flex-1 items-center justify-end pt-2'>
            <Search setQueryParams={setQueryParams} />
            <div className='ml-2'>
              <SampleTableFilter />
            </div>
          </div>
        </div>
      }
      columns={[
        ...getSampleTableColumn({
          setSort: (newOrder: string) => {
            setQueryParams({ ordering: newOrder });
          },
          currentSort: queryParams?.ordering,
        }),
        ...getLibraryTableColumn(),
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
 * Process results record to a flat array of json. Unpack sample and subject from nested
 * JSON object
 * @param data the results returned from the API
 * @returns
 */
const processDataResults = (data: components['schemas']['SampleDetail'][]) => {
  return data.map((smp) => {
    const rec = {
      // Library Model
      sampleIds: {
        orcabusId: smp.orcabusId,
        sampleId: smp.sampleId,
      },
      source: smp.source ?? '-',

      // libraries
      libraryIds: [] as { libraryId: string; libraryOrcabusId: string }[],
      phenotype: [] as string[],
      workflow: [] as string[],
      quality: [] as string[],
      type: [] as string[],
      assay: [] as string[],
      coverage: [] as string[],
    };

    for (const lib of smp.librarySet) {
      rec.libraryIds.push({
        libraryId: lib.libraryId ?? '-',
        libraryOrcabusId: lib.orcabusId,
      });
      rec.phenotype.push(lib.phenotype ?? '-');
      rec.workflow.push(lib.workflow ?? '-');
      rec.quality.push(lib.quality ?? '-');
      rec.type.push(lib.type ?? '-');
      rec.assay.push(lib.assay ?? '-');
      rec.coverage.push(lib.coverage?.toString() ?? '-');
    }

    return rec;
  });
};

/**
 * Table Columns Properties
 */

// Exported as it might be useful for other components when rendering the Library Table
export const getSampleTableColumn = ({
  setSort,
  currentSort,
}: {
  setSort?: (newOrder: string) => void;
  currentSort?: string;
}): Column[] => [
  {
    header: 'Sample Id',
    headerGroup: { colSpan: 3 },
    accessor: 'sampleIds',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'sample_id'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'sample_id'),
    cell: (p: unknown) => {
      const ids = p as { orcabusId: string; sampleId: string };
      return (
        <Link
          to={`/lab/?tab=sample&orcabusId=${ids.orcabusId}`}
          className={classNames(
            'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
          )}
        >
          {ids.sampleId}
        </Link>
      );
    },
  },
  {
    header: 'External Sample Id',
    accessor: 'externalSampleId',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'externalSampleId'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'externalSampleId'),
  },
  {
    header: 'Source',
    accessor: 'source',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'source'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'source'),
  },
];

export const getLibraryTableColumn = (): Column[] => {
  const cellColor = {
    headerClassName: 'bg-orange-100',
    cellClassName: 'bg-orange-50',
  };
  return [
    {
      header: 'Library Id',
      headerClassName: cellColor.headerClassName,
      headerGroup: { label: 'Library', colSpan: 7, additionalClassName: cellColor.headerClassName },
      accessor: 'libraryIds',
      cell: (p: unknown) => {
        const data = p as { libraryId: string; libraryOrcabusId: string }[];
        return (
          <Fragment>
            {data.map((lib, idx) => {
              if (!lib.libraryId) {
                return <div key={idx}>-</div>;
              }
              return (
                <div className='py-2' key={idx}>
                  <Link
                    to={`library/${lib.libraryId}`}
                    className={classNames(
                      'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                    )}
                  >
                    {lib.libraryId}
                  </Link>
                </div>
              );
            })}
          </Fragment>
        );
      },
      cellClassName: cellColor.cellClassName,
    },
    {
      header: 'Phenotype',
      headerClassName: cellColor.headerClassName,
      accessor: 'phenotype',
      cell: multiRowCell,
      cellClassName: cellColor.cellClassName,
    },
    {
      header: 'Workflow',
      headerClassName: cellColor.headerClassName,
      accessor: 'workflow',
      cell: multiRowCell,
      cellClassName: cellColor.cellClassName,
    },
    {
      header: 'Quality',
      headerClassName: cellColor.headerClassName,
      accessor: 'quality',
      cell: multiRowCell,
      cellClassName: cellColor.cellClassName,
    },
    {
      header: 'Type',
      headerClassName: cellColor.headerClassName,
      accessor: 'type',
      cell: multiRowCell,
      cellClassName: cellColor.cellClassName,
    },
    {
      header: 'Assay',
      headerClassName: cellColor.headerClassName,
      accessor: 'assay',
      cell: multiRowCell,
      cellClassName: cellColor.cellClassName,
    },
    {
      header: 'Coverage',
      headerClassName: cellColor.headerClassName,
      accessor: 'coverage',
      cell: multiRowCell,
      cellClassName: cellColor.cellClassName,
    },
  ];
};
