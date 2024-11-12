import { Column } from '@/components/tables';
import { getCurrentSortDirection, getSortValue } from '@/components/tables/Table';

export const getContactTableColumn = ({
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
    header: 'Contact Id',
    headerClassName: headerClassName,
    // colSpan=2 because the length of Column array
    headerGroup: { colSpan: 2, label: headerGroupLabel, additionalClassName: headerClassName },
    accessor: 'contactIds',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'contact_id'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'contact_id'),
    cell: (p: unknown) => {
      type ContactIdType = { contactOrcabusId: string; contactId: string };
      const props = p as ContactIdType | ContactIdType[];

      let data: ContactIdType[] = [];
      if (!Array.isArray(props)) {
        data = [props];
      } else {
        data = props;
      }

      return (
        <>
          {data.map((prj, idx) => (
            <div className='py-2' key={idx}>
              {prj.contactId}
              {/* <Link
                to={`/lab/?tab=contact&orcabusId=${prj.contactOrcabusId}`}
                className={classNames(
                  'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
                )}
              >
                {prj.contactId}
              </Link> */}
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
    accessor: 'contactName',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'name'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'name'),
    cellClassName: cellClassName,
  },
];
