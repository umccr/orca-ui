import { Column } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { Link } from 'react-router-dom';
import { getCurrentSortDirection, getSortValue } from '@/components/tables/Table';

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
    headerClassName: headerClassName,
    // colSpan=2 because the length of Column array
    headerGroup: { colSpan: 2, label: headerGroupLabel, additionalClassName: headerClassName },
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
              <Link
                to={`/lab/?tab=project&orcabusId=${prj.projectOrcabusId}`}
                className={classNames(
                  'ml-2 text-sm font-medium text-blue-500 capitalize hover:text-blue-700'
                )}
              >
                {prj.projectId}
              </Link>
            </div>
          ))}
        </>
      );
    },
    cellClassName: cellClassName,
  },
  {
    header: 'Name',
    headerClassName: headerClassName,
    accessor: 'projectName',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'name'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'name'),
    cellClassName: cellClassName,
  },
];
