import React from 'react';
import { IndividualListQueryParams, useMetadataIndividualModel } from '@/api/metadata';
import { useQueryParams } from '@/hooks/useQueryParams';
import { components } from '@/api/types/metadata';
import { Column, Table } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { Link } from 'react-router-dom';
import { getCurrentSortDirection, getSortValue } from '@/components/tables/Table';
import { Search } from '@/components/common/search';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/common/tooltips';
import { IndividualTableFilter } from './IndividualTableFilter';

export const IndividualListAPITable = ({
  queryParams,
}: {
  queryParams: IndividualListQueryParams;
}) => {
  const { setQueryParams, getPaginationParams } = useQueryParams();

  const individualModel = useMetadataIndividualModel({
    params: { query: { ...queryParams, ...getPaginationParams() } },
  });

  const data = individualModel.data;
  if (!data) {
    throw new Error('No individual data found!');
  }

  const flatData = processResult(data.results);
  const pagination = data.pagination;
  return (
    <Table
      inCard={false}
      tableHeader={
        <div className='flex flex-col md:flex-row'>
          <div className='flex items-center justify-center'>{'Individual Table'}</div>
          <div className='flex flex-1 items-center justify-end pt-2'>
            <Search setQueryParams={setQueryParams} />
            <div className='ml-2'>
              <IndividualTableFilter />
            </div>
          </div>
        </div>
      }
      columns={[
        ...getIndividualTableColumn({
          setSort: (newOrder: string) => {
            setQueryParams({ ordering: newOrder });
          },
          currentSort: queryParams?.ordering,
        }),
        ...getSubjectColumn(),
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
const processResult = (data: components['schemas']['IndividualDetail'][]) => {
  return data.map((idv) => {
    const rec: Record<string, unknown> = {
      // Library Model
      individualIds: {
        orcabusId: idv.orcabusId,
        individualId: idv.individualId,
      },
      source: idv.source ?? '-',

      // subject
      subjectIds: idv.subjectSet.map((subject) => ({
        subjectId: subject.subjectId,
        orcabusId: subject.orcabusId,
      })),
    };
    return rec;
  });
};

/**
 * Table Columns Properties
 */

export const getIndividualTableColumn = ({
  setSort,
  currentSort,
}: {
  setSort?: (newOrder: string) => void;
  currentSort?: string;
}): Column[] => [
  {
    header: (
      <div className='flex flex-row items-center'>
        <div>Individual Id</div>
        <Tooltip text={`This is now the 'SubjectID' from the tracking sheet`} position='right'>
          <InformationCircleIcon className='h-4	ml-2' />
        </Tooltip>
      </div>
    ),
    headerGroup: { colSpan: 2 },
    accessor: 'individualIds',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'individual_id'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'individual_id'),
    cell: (p: unknown) => {
      const ids = p as { orcabusId: string; individualId: string };
      return (
        <>{ids.individualId}</>
        // <Link
        //   to={`/lab/library/${ids.individualId}`}
        //   className={classNames(
        //     'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
        //   )}
        // >
        //   {ids.individualId}
        // </Link>
      );
    },
  },
  {
    header: 'Record Source',
    accessor: 'source',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'source'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'source'),
  },
];

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
        const subData = data as { orcabusId: string; subjectId: string }[];

        return (
          <>
            {subData.map((item, idx) => (
              <div className='py-2' key={idx}>
                <Link
                  to={`/lab/?tab=subject&orcabusId=${item.orcabusId}`}
                  className={classNames(
                    'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                  )}
                >
                  {item.subjectId}
                </Link>
              </div>
            ))}
          </>
        );
      },
      cellClassName: cellColor.cellClassName,
    },
  ];
};
