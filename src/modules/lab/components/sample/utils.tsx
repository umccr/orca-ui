import { Column } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { Link } from 'react-router-dom';
import { getCurrentSortDirection, getSortValue } from '@/components/tables/Table';

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
    headerClassName: headerClassName,
    // colSpan=3 because the length of Column array
    headerGroup: { colSpan: 3, label: headerGroupLabel, additionalClassName: headerClassName },
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
          <Link
            to={`/lab/?tab=sample&orcabusId=${props.sampleOrcabusId}`}
            className={classNames(
              'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
            )}
          >
            {props.sampleId}
          </Link>
        </div>
      );
    },
    cellClassName: cellClassName,
  },
  {
    header: 'External Sample Id',
    headerClassName: headerClassName,
    accessor: 'sampleExternalId',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'externalSampleId'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'externalSampleId'),
    cellClassName: cellClassName,
  },
  {
    header: 'Source',
    headerClassName: headerClassName,
    accessor: 'sampleSource',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'source'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'source'),
    cellClassName: cellClassName,
  },
];
