import React from 'react';
import { Column } from '@/components/tables';
import { getCurrentSortDirection, getSortValue } from '@/components/tables/Table';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/common/tooltips';

export const getIndividualTableColumn = ({
  cellClassName,
  headerClassName,
  headerGroupLabel,
  setSort,
  currentSort,
}: {
  cellClassName?: string;
  headerClassName?: string;
  headerGroupLabel?: string;
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
    headerClassName: headerClassName,
    // Number '2' is the length of this array
    headerGroup: { colSpan: 2, label: headerGroupLabel, additionalClassName: headerClassName },
    accessor: 'individualIds',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'individual_id'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'individual_id'),
    cell: (p: unknown) => {
      const ids = p as { individualOrcabusId: string; individualId: string };
      return <>{ids.individualId}</>;
    },
    cellClassName: cellClassName,
  },
  {
    header: 'Record Source',
    headerClassName: headerClassName,
    accessor: 'individualSource',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'source'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'source'),
    cellClassName: cellClassName,
  },
];
