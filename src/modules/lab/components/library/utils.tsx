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
    headerClassName: headerClassName,
    // Number '7' is the length of this array
    headerGroup: { colSpan: 7, label: headerGroupLabel, additionalClassName: headerClassName },
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
                  'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                )}
              >
                {lib.libraryId}
              </Link>
            </div>
          ))}
        </>
      );
    },
    cellClassName: cellClassName,
  },
  {
    header: 'Phenotype',
    headerClassName: headerClassName,
    accessor: 'phenotype',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'phenotype '));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'phenotype'),
    cell: multiRowCell,
    cellClassName: cellClassName,
  },
  {
    header: 'Workflow',
    headerClassName: headerClassName,
    accessor: 'workflow',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'workflow'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'workflow'),
    cell: multiRowCell,
    cellClassName: cellClassName,
  },
  {
    header: 'Quality',
    headerClassName: headerClassName,
    accessor: 'quality',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'quality'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'quality'),
    cell: multiRowCell,
    cellClassName: cellClassName,
  },
  {
    header: 'Type',
    headerClassName: headerClassName,
    accessor: 'type',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'type'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'type'),
    cell: multiRowCell,
    cellClassName: cellClassName,
  },
  {
    header: 'Assay',
    headerClassName: headerClassName,
    accessor: 'assay',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'assay'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'assay'),
    cell: multiRowCell,
    cellClassName: cellClassName,
  },
  {
    header: 'Coverage',
    headerClassName: headerClassName,
    accessor: 'coverage',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'coverage'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'coverage'),
    cell: multiRowCell,
    cellClassName: cellClassName,
  },
];
