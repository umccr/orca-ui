import { Column } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { getCurrentSortDirection, getSortValue } from '@/components/tables/Table';
import { RedirectLink } from '@/components/common/link';

export const getSampleTableColumn = ({
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
    header: 'Sample Id',
    headerClassName: classNames(
      'bg-red-50/90 dark:bg-red-900/40',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      headerClassName
    ),
    headerGroup: {
      colSpan: 3,
      label: headerGroupLabel,
      additionalClassName: classNames(
        'bg-red-50/90 dark:bg-red-900/40',
        'text-gray-900 dark:text-gray-100',
        'transition-all duration-200',
        headerClassName
      ),
    },
    accessor: 'sampleIds',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'sample_id'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'sample_id'),
    cell: (p: unknown) => {
      type SampleIdType = { sampleOrcabusId: string; sampleId: string };
      const props = p as SampleIdType;

      return (
        <div className='py-2'>
          <RedirectLink to={`/lab/sample/${props.sampleOrcabusId}`}>{props.sampleId}</RedirectLink>
        </div>
      );
    },
    cellClassName: classNames(
      'bg-red-50/80 dark:bg-red-900/30',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      cellClassName
    ),
  },
  {
    header: 'External Sample Id',
    headerClassName: classNames(
      'bg-red-50/90 dark:bg-red-900/40',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      headerClassName
    ),
    accessor: 'sampleExternalId',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'externalSampleId'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'externalSampleId'),
    cellClassName: classNames(
      'bg-red-50/80 dark:bg-red-900/30',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      cellClassName
    ),
  },
  {
    header: 'Source',
    headerClassName: classNames(
      'bg-red-50/90 dark:bg-red-900/40',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      headerClassName
    ),
    accessor: 'sampleSource',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'source'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'source'),
    cellClassName: classNames(
      'bg-red-50/80 dark:bg-red-900/30',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      cellClassName
    ),
  },
];
