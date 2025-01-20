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

export const SubjectListAPITable = ({ queryParams }: { queryParams: SubjectListQueryParams }) => {
  const { setQueryParams, getPaginationParams } = useQueryParams();

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
            <Search onSearch={(s) => setQueryParams({ search: s })} />
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
        }),
        ...individualTableColumn(),
        ...getLibraryTableColumn({
          headerGroupLabel: 'Library',
          headerClassName: 'bg-red-100',
          cellClassName: 'bg-red-50',
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
          <Tooltip text={`This is now the 'SubjectID' from the tracking sheet`} position='right'>
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
