import { Column } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { Tooltip } from '@/components/common/tooltips';
import { getCurrentSortDirection, getSortValue } from '@/components/tables/Table';
import { RedirectLink } from '@/components/common/link';

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
        <div>Subject ID</div>
        <Tooltip
          text={`This is now the 'ExternalSubjectID' from the tracking sheet`}
          position='right'
          background='light'
          size='small'
          className='z-50 w-96 text-wrap whitespace-normal'
        >
          <InformationCircleIcon className='ml-2 h-4' />
        </Tooltip>
      </div>
    ),
    headerClassName: classNames(
      'bg-indigo-50/90 dark:bg-indigo-900/30',
      'text-gray-800 dark:text-gray-100',
      'transition-all duration-200',
      headerClassName
    ),
    // The length of Column array is 1
    headerGroup: {
      label: headerGroupLabel,
      colSpan: 1,
      additionalClassName: classNames(
        'bg-indigo-50/90 dark:bg-indigo-900/30',
        'text-gray-800 dark:text-gray-100',
        'transition-all duration-200',
        headerClassName
      ),
    },
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
              <RedirectLink to={`/lab/?tab=subject&orcabusId=${sbj.subjectOrcabusId}`}>
                {sbj.subjectId ?? '-'}
              </RedirectLink>
            </div>
          ))}
        </>
      );
    },
    cellClassName: classNames(
      'bg-indigo-50/80 dark:bg-indigo-950/10',
      'text-gray-800 dark:text-gray-100',
      'transition-colors duration-200',
      cellClassName
    ),
  },
];
