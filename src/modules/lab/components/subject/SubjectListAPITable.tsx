import React, { Fragment } from 'react';
import { SubjectListQueryParams, useMetadataSubjectModel } from '@/api/metadata';
import { useQueryParams } from '@/hooks/useQueryParams';
import { Column } from '@/components/tables';
import Table, {
  getCurrentSortDirection,
  getSortValue,
  multiRowCell,
} from '@/components/tables/Table';
import { Link } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';
import { components } from '@/api/types/metadata';
import { Search } from '@/components/common/search';
import { SubjectTableFilter } from './SubjectTableFilter';
import { Tooltip } from '@/components/common/tooltips';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export const SubjectListAPITable = ({ queryParams }: { queryParams: SubjectListQueryParams }) => {
  const { setQueryParams, getPaginationParams } = useQueryParams();

  const fullLibraryModel = useMetadataSubjectModel({
    params: { query: { ...queryParams, ...getPaginationParams() } },
  });
  const data = fullLibraryModel.data;
  if (!data) {
    throw new Error('No subject data found!');
  }
  const tableData = processSubjectResult(data.results);
  const pagination = data.pagination;
  return (
    <Table
      inCard={false}
      tableHeader={
        <div className='flex flex-col md:flex-row'>
          <div className='flex items-center justify-center'>{'Subject Table'}</div>
          <div className='flex flex-1 items-center justify-end pt-2'>
            <Search setQueryParams={setQueryParams} />

            <div className='ml-2'>
              <SubjectTableFilter />
            </div>
          </div>
        </div>
      }
      columns={[
        {
          header: (
            <div className='flex flex-row items-center'>
              <div>Subject Id</div>
              <Tooltip
                text={`This is now the 'ExternalSubjectID' from the tracking sheet`}
                position='right'
              >
                <InformationCircleIcon className='h-4	ml-2' />
              </Tooltip>
            </div>
          ),
          accessor: 'subjectIds',
          headerGroup: { colSpan: 1 },
          onSort: () =>
            setQueryParams({
              ordering: getSortValue(queryParams?.ordering, 'subject_id'),
            }),
          sortDirection: getCurrentSortDirection(queryParams?.ordering, 'subject_id'),
          cell: (p: unknown) => {
            const data = p as { subjectId: string; subjectOrcabusId: string };
            return (
              <Link
                to={`/lab/?tab=subject&orcabusId=${data.subjectOrcabusId}`}
                className={classNames(
                  'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                )}
              >
                {data.subjectId}
              </Link>
            );
          },
        },
        ...individualTableColumn(),
        ...getLibraryTableColumn(),
      ]}
      tableData={tableData}
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
 * Process subject results record to table recognisable data where each cell could have multiple row
 * @param data the results returned from the API
 * @returns
 */
const processSubjectResult = (data: components['schemas']['SubjectDetail'][]) => {
  return data.map((subject) => {
    const rec: Record<string, unknown[]> = {
      // Individual
      individualIds: [],
      individualSource: [],

      // libraries
      libraryIds: [],
      phenotype: [],
      workflow: [],
      quality: [],
      type: [],
      assay: [],
      coverage: [],
    };

    for (const library of subject.librarySet) {
      rec.libraryIds.push({
        libraryId: library.libraryId ?? '-',
        libraryOrcabusId: library.orcabusId,
      });
      rec.phenotype.push(library.phenotype ?? '-');
      rec.workflow.push(library.workflow ?? '-');
      rec.quality.push(library.quality ?? '-');
      rec.type.push(library.type ?? '-');
      rec.assay.push(library.assay ?? '-');
      rec.coverage.push(library.coverage?.toString() ?? '-');
    }

    for (const individual of subject.individualSet) {
      rec.individualIds.push({
        individualId: individual.individualId ?? '-',
        individualOrcabusId: individual.orcabusId,
      });
      rec.individualSource.push(individual.source ?? '-');
    }

    return {
      subjectIds: {
        subjectOrcabusId: subject.orcabusId,
        subjectId: subject.subjectId,
      },
      ...rec,
    };
  });
};

/**
 * Library column properties
 */
export const getLibraryTableColumn = (): Column[] => {
  const cellColor = {
    headerClassName: 'bg-red-100',
    cellClassName: 'bg-red-50',
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

export const individualTableColumn = (): Column[] => {
  const cellColor = {
    headerClassName: 'bg-orange-100',
    cellClassName: 'bg-orange-50',
  };
  return [
    {
      header: (
        <div className='flex flex-row items-center'>
          <div>Individual Id</div>
          <Tooltip text={`This is now the 'SubjectID' from the tracking sheet`} position='top'>
            <InformationCircleIcon className='h-4	ml-2' />
          </Tooltip>
        </div>
      ),
      accessor: 'individualIds',
      headerGroup: {
        label: 'Individual',
        colSpan: 2,
        additionalClassName: cellColor.headerClassName,
      },
      cell: (p: unknown) => {
        const data = p as { individualId: string; individualOrcabusId: string }[];
        return (
          <Fragment>
            {data.map((idv, idx) => {
              if (!idv.individualId) {
                return <div key={idx}>-</div>;
              }
              return (
                <div className='py-2' key={idx}>
                  {idv.individualId}
                  {/* <Link
                  to={`individual/${idv.individualId}`}
                  className={classNames(
                    'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                  )}
                >
                  {idv.individualId}
                </Link> */}
                </div>
              );
            })}
          </Fragment>
        );
      },
      headerClassName: cellColor.headerClassName,
      cellClassName: cellColor.cellClassName,
    },
    {
      header: 'Individual Record Source',
      accessor: 'individualSource',
      cell: multiRowCell,
      headerClassName: cellColor.headerClassName,
      cellClassName: cellColor.cellClassName,
    },
  ];
};
