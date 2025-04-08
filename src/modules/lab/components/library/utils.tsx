import { Column } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { Link } from 'react-router-dom';
import { getCurrentSortDirection, getSortValue, multiRowCell } from '@/components/tables/Table';

export const getLibraryTableColumn = ({
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
    header: 'Library Id',
    headerClassName: classNames(
      'bg-blue-50/90 dark:bg-blue-900/40',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      headerClassName
    ),
    headerGroup: {
      colSpan: 8,
      label: headerGroupLabel,
      additionalClassName: classNames(
        'bg-blue-50/90 dark:bg-blue-900/40',
        'text-gray-900 dark:text-gray-100',
        'transition-all duration-200',
        headerClassName
      ),
    },
    accessor: 'libraryIds',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'library_id'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'library_id'),
    cell: (p: unknown) => {
      type LibraryIdType = { libraryOrcabusId: string; libraryId: string };
      const props = p as LibraryIdType | LibraryIdType[];

      let data: LibraryIdType[] = [];
      if (!Array.isArray(props)) {
        data = [props];
      } else {
        data = props;
      }

      return (
        <>
          {data.map((lib, idx) => (
            <div className='py-2' key={idx}>
              <Link
                to={`/lab/library/${lib.libraryOrcabusId}/overview`}
                className={classNames(
                  'ml-2 text-sm font-medium text-blue-600 hover:text-blue-700',
                  'dark:text-blue-400 dark:hover:text-blue-300',
                  'transition-colors duration-200'
                )}
              >
                {lib.libraryId}
              </Link>
            </div>
          ))}
        </>
      );
    },
    cellClassName: classNames(
      'bg-blue-50/80 dark:bg-blue-900/30',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      cellClassName
    ),
  },
  {
    header: 'Phenotype',
    headerClassName: classNames(
      'bg-blue-50/90 dark:bg-blue-900/40',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      headerClassName
    ),
    accessor: 'phenotype',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'phenotype '));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'phenotype'),
    cell: multiRowCell,
    cellClassName: classNames(
      'bg-blue-50/80 dark:bg-blue-900/30',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      cellClassName
    ),
  },
  {
    header: 'Workflow',
    headerClassName: classNames(
      'bg-blue-50/90 dark:bg-blue-900/40',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      headerClassName
    ),
    accessor: 'workflow',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'workflow'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'workflow'),
    cell: multiRowCell,
    cellClassName: classNames(
      'bg-blue-50/80 dark:bg-blue-900/30',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      cellClassName
    ),
  },
  {
    header: 'Quality',
    headerClassName: classNames(
      'bg-blue-50/90 dark:bg-blue-900/40',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      headerClassName
    ),
    accessor: 'quality',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'quality'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'quality'),
    cell: multiRowCell,
    cellClassName: classNames(
      'bg-blue-50/80 dark:bg-blue-900/30',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      cellClassName
    ),
  },
  {
    header: 'Type',
    headerClassName: classNames(
      'bg-blue-50/90 dark:bg-blue-900/40',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      headerClassName
    ),
    accessor: 'type',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'type'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'type'),
    cell: multiRowCell,
    cellClassName: classNames(
      'bg-blue-50/80 dark:bg-blue-900/30',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      cellClassName
    ),
  },
  {
    header: 'Assay',
    headerClassName: classNames(
      'bg-blue-50/90 dark:bg-blue-900/40',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      headerClassName
    ),
    accessor: 'assay',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'assay'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'assay'),
    cell: multiRowCell,
    cellClassName: classNames(
      'bg-blue-50/80 dark:bg-blue-900/30',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      cellClassName
    ),
  },
  {
    header: 'Coverage',
    headerClassName: classNames(
      'bg-blue-50/90 dark:bg-blue-900/40',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      headerClassName
    ),
    accessor: 'coverage',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'coverage'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'coverage'),
    cell: multiRowCell,
    cellClassName: classNames(
      'bg-blue-50/80 dark:bg-blue-900/30',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      cellClassName
    ),
  },
  {
    header: 'Override Cycles',
    headerClassName: classNames(
      'bg-blue-50/90 dark:bg-blue-900/40',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      headerClassName
    ),
    accessor: 'overrideCycles',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'overrideCycles'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'overrideCycles'),
    cell: multiRowCell,
    cellClassName: classNames(
      'bg-blue-50/80 dark:bg-blue-900/30',
      'text-gray-900 dark:text-gray-100',
      'transition-all duration-200',
      cellClassName
    ),
  },
];
