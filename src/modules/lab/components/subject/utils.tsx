import { Column } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { Link } from 'react-router-dom';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/common/tooltips';
import { getCurrentSortDirection, getSortValue } from '@/components/tables/Table';

export const getSubjectTableColumn = ({
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
        <div>Subject Id</div>
        <Tooltip
          text={`This is now the 'ExternalSubjectID' from the tracking sheet`}
          position='top'
        >
          <InformationCircleIcon className='h-4	ml-2' />
        </Tooltip>
      </div>
    ),
    headerClassName: headerClassName,
    // The length of Column array is 1
    headerGroup: { label: headerGroupLabel, colSpan: 1, additionalClassName: headerClassName },
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'subject_id'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'subject_id'),
    accessor: 'subjectIds',
    cell: (p: unknown) => {
      type SubjectIdType = { subjectOrcabusId: string; subjectId: string };
      const props = p as SubjectIdType | SubjectIdType[];

      let data: SubjectIdType[] = [];
      if (!Array.isArray(props)) {
        data = [props];
      } else {
        data = props;
      }

      return (
        <>
          {data.map((sbj, idx) => (
            <div className='py-2' key={idx}>
              <Link
                to={`/lab/?tab=subject&orcabusId=${sbj.subjectOrcabusId}`}
                className={classNames(
                  'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                )}
              >
                {sbj.subjectId ?? '-'}
              </Link>
            </div>
          ))}
        </>
      );
    },
    cellClassName: cellClassName,
  },
];
