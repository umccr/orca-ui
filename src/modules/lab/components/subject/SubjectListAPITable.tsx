/* eslint-disable react-refresh/only-export-components */
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347

import { Fragment } from 'react';
import { SubjectListQueryParams, useSuspenseMetadataSubjectModel } from '@/api/metadata';
import { useQueryParams } from '@/hooks/useQueryParams';
import { Column } from '@/components/tables';
import Table, { multiRowCell } from '@/components/tables/Table';
import { components } from '@/api/types/metadata';
import { Search } from '@/components/common/search';
import { SubjectTableFilter } from './SubjectTableFilter';
import { Tooltip } from '@/components/common/tooltips';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { getLibraryTableColumn } from '../library/utils';
import { getSubjectTableColumn } from './utils';
import { classNames } from '@/utils/commonUtils';

export const SubjectListAPITable = ({ queryParams }: { queryParams: SubjectListQueryParams }) => {
  const { setQueryParams, getPaginationParams, getQueryParams } = useQueryParams();

  const fullLibraryModel = useSuspenseMetadataSubjectModel({
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
            <div className='w-1/5'>
              <Search
                onSearch={(s) => setQueryParams({ search: s })}
                searchBoxContent={getQueryParams().search}
              />
            </div>
            <div className='ml-2'>
              <SubjectTableFilter />
            </div>
          </div>
        </div>
      }
      columns={[
        ...getSubjectTableColumn({
          setSort: (newOrder: string) => {
            setQueryParams({ ordering: newOrder });
          },
          currentSort: queryParams?.ordering,
          headerClassName: 'bg-transparent',
          cellClassName: 'bg-transparent',
        }),
        ...individualTableColumn(),
        ...getLibraryTableColumn({
          headerGroupLabel: 'Library',
          // headerClassName: 'bg-red-100',
          // cellClassName: 'bg-red-50',
        }),
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
      overrideCycles: [],
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
      rec.overrideCycles.push(library.overrideCycles ?? '-');
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

export const individualTableColumn = (): Column[] => {
  const cellColor = {
    headerClassName: classNames(
      'bg-cyan-100/60 dark:bg-cyan-800/30',
      'text-gray-800 dark:text-gray-100',
      'transition-colors duration-200'
    ),
    cellClassName: classNames(
      'bg-cyan-100/60 dark:bg-cyan-800/30',
      'text-gray-800 dark:text-gray-100',
      'transition-colors duration-200'
    ),
  };
  return [
    {
      header: (
        <div className='flex flex-row items-center'>
          <div>Individual ID</div>
          <Tooltip
            text={`This is now the 'SubjectID' from the tracking sheet`}
            position='right'
            background='light'
            size='small'
            className='z-50 w-96 text-wrap whitespace-normal'
          >
            <InformationCircleIcon className='ml-2 h-4 text-amber-700 dark:text-amber-300' />
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
              return (
                <div key={idx} className='py-2'>
                  {!idv.individualId ? '-' : idv.individualId}
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
