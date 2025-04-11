import { Column } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { getCurrentSortDirection, getSortValue } from '@/components/tables/Table';
import { RedirectLink } from '@/components/common/link';

export const getProjectTableColumn = ({
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
    header: 'Project Id',
    headerClassName: classNames(
      'bg-sky-50/80 dark:bg-sky-900/20',
      'text-gray-900 dark:text-gray-100',
      'transition-colors duration-200',
      headerClassName
    ),
    headerGroup: {
      colSpan: 2,
      label: headerGroupLabel,
      additionalClassName: classNames(
        'bg-sky-50/80 dark:bg-sky-900/20',
        'text-gray-900 dark:text-gray-100',
        'transition-colors duration-200',
        headerClassName
      ),
    },
    accessor: 'projectIds',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'project_id'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'project_id'),
    cell: (p: unknown) => {
      type ProjectIdType = { projectOrcabusId: string; projectId: string };
      const props = p as ProjectIdType | ProjectIdType[];

      let data: ProjectIdType[] = [];
      if (!Array.isArray(props)) {
        data = [props];
      } else {
        data = props;
      }

      return (
        <>
          {data.map((prj, idx) => (
            <div className='py-2' key={idx}>
              <RedirectLink to={`/lab/?tab=project&orcabusId=${prj.projectOrcabusId}`}>
                {prj.projectId}
              </RedirectLink>
            </div>
          ))}
        </>
      );
    },
    cellClassName: classNames(
      'bg-sky-50/60 dark:bg-sky-900/10',
      'text-gray-900 dark:text-gray-100',
      'transition-colors duration-200',
      cellClassName
    ),
  },
  {
    header: 'Name',
    headerClassName: classNames(
      'bg-sky-50/80 dark:bg-sky-900/20',
      'text-gray-900 dark:text-gray-100',
      'transition-colors duration-200',
      headerClassName
    ),
    accessor: 'projectName',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'name'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'name'),
    cellClassName: classNames(
      'bg-sky-50/60 dark:bg-sky-900/10',
      'text-gray-900 dark:text-gray-100',
      'transition-colors duration-200',
      cellClassName
    ),
  },
];
