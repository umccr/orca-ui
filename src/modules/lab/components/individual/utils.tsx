import { Column } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
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
        <Tooltip
          text={`This is now the 'ExternalIndividualID' from the tracking sheet`}
          position='right'
          background='light'
          size='small'
          className='z-50 w-96 text-wrap whitespace-normal'
        >
          <InformationCircleIcon className='ml-2 h-4 text-gray-500 dark:text-gray-400' />
        </Tooltip>
      </div>
    ),
    headerClassName: classNames(
      'bg-violet-50/90 dark:bg-violet-800/30',
      'text-gray-800 dark:text-gray-100',
      'transition-colors duration-200',
      headerClassName
    ),
    // Number '2' is the length of this array
    headerGroup: {
      colSpan: 2,
      label: headerGroupLabel,
      additionalClassName: classNames(
        'bg-violet-50/90 dark:bg-violet-800/30',
        'text-gray-800 dark:text-gray-100',
        'transition-colors duration-200',
        headerClassName
      ),
    },
    accessor: 'individualIds',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'individual_id'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'individual_id'),
    cell: (p: unknown) => {
      const ids = p as { individualOrcabusId: string; individualId: string };
      return (
        <div
          className={classNames(
            'text-gray-900 dark:text-gray-300',
            'transition-colors duration-200',
            cellClassName
          )}
        >
          {ids.individualId}
        </div>
      );
    },
    cellClassName: classNames(
      'bg-violet-50/90 dark:bg-violet-800/30',
      'text-gray-800 dark:text-gray-100',
      'transition-colors duration-200',
      cellClassName
    ),
  },
  {
    header: 'Record Source',
    headerClassName: classNames(
      'bg-violet-50/90 dark:bg-violet-800/30',
      'text-gray-800 dark:text-gray-100',
      'transition-colors duration-200',
      headerClassName
    ),
    accessor: 'individualSource',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'source'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'source'),
    cellClassName: classNames(
      'bg-violet-50/90 dark:bg-violet-800/30',
      'text-gray-800 dark:text-gray-100',
      'transition-colors duration-200',
      cellClassName
    ),
  },
];
