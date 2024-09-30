import React, { Fragment } from 'react';
import { SubjectListQueryParams, useMetadataSubjectModel } from '@/api/metadata';
import { useQueryParams } from '@/hooks/useQueryParams';
import { Column } from '@/components/tables';
import Table, {
  getCurrentSortDirection,
  getSetSortValue,
  multiRowCel,
} from '@/components/tables/Table';
import { Link } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';
import { components } from '@/api/types/metadata';
import { Search } from '@/components/common/search';
import { SubjectTableFilter } from './SubjectTableFilter';

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
          header: 'Subject Id',
          accessor: 'subjectIds',
          onSort: () =>
            setQueryParams({
              ordering: getSetSortValue(queryParams?.ordering, 'subject_id'),
            }),
          sortDirection: getCurrentSortDirection(queryParams?.ordering, 'subject_id'),
          cell: (p: unknown) => {
            const data = p as { subjectId: string; subjectOrcabusId: string };
            return (
              <Link
                to={`/lab/subject/${data.subjectOrcabusId}`}
                className={classNames(
                  'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                )}
              >
                {data.subjectId}
              </Link>
            );
          },
        },
        ...individualTableColumn,
        ...libraryTableColumn,
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
export const libraryTableColumn: Column[] = [
  {
    header: 'Library Id',
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
  },
  {
    header: 'Phenotype',
    accessor: 'phenotype',
    cell: multiRowCel,
  },
  {
    header: 'Workflow',
    accessor: 'workflow',
    cell: multiRowCel,
  },
  {
    header: 'Quality',
    accessor: 'quality',
    cell: multiRowCel,
  },
  {
    header: 'Type',
    accessor: 'type',
    cell: multiRowCel,
  },
  {
    header: 'Assay',
    accessor: 'assay',
    cell: multiRowCel,
  },
  {
    header: 'Coverage',
    accessor: 'coverage',
    cell: multiRowCel,
  },
];

export const individualTableColumn: Column[] = [
  {
    header: 'Individual Id',
    accessor: 'individualIds',
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
  },
  {
    header: 'Individual Record Source',
    accessor: 'individualSource',
    cell: multiRowCel,
  },
];
