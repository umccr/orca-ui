import { Column } from '@/components/tables';
import { classNames } from '@/utils/commonUtils';
import { getCurrentSortDirection, getSortValue, multiRowCell } from '@/components/tables/Table';

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
    headerClassName: classNames(
      'bg-rose-50/80 dark:bg-rose-900/20',
      'text-gray-900 dark:text-gray-100',
      'transition-colors duration-200',
      headerClassName
    ),
    // colSpan=2 because the length of Column array
    headerGroup: {
      colSpan: 2,
      label: headerGroupLabel,
      additionalClassName: classNames(
        'bg-rose-50/80 dark:bg-rose-900/20',
        'text-gray-900 dark:text-gray-100',
        'transition-colors duration-200',
        headerClassName
      ),
    },
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
          {data.map((contact, idx) => (
            <div
              className={classNames(
                'py-2',
                'text-gray-900 dark:text-gray-300',
                'transition-colors duration-200'
              )}
              key={idx}
            >
              {contact.contactId ?? '-'}
              {/* <Link
                to={`/lab/?tab=contact&orcabusId=${contact.contactOrcabusId}`}
                className={classNames(
                  'ml-2 text-sm font-medium text-blue-500 capitalize hover:text-blue-700',
                  'dark:text-blue-400 dark:hover:text-blue-300'
                )}
              >
                {contact.contactId}
              </Link> */}
            </div>
          ))}
        </>
      );
    },
    cellClassName: classNames(
      'bg-rose-50/60 dark:bg-rose-900/10',
      'text-gray-900 dark:text-gray-100',
      'transition-colors duration-200',
      cellClassName
    ),
  },
  {
    header: 'Name',
    headerClassName: classNames(
      'bg-rose-50/80 dark:bg-rose-900/20',
      'text-gray-900 dark:text-gray-100',
      'transition-colors duration-200',
      headerClassName
    ),
    accessor: 'contactName',
    onSort: setSort
      ? () => {
          setSort(getSortValue(currentSort, 'name'));
        }
      : undefined,
    sortDirection: getCurrentSortDirection(currentSort, 'name'),
    cellClassName: classNames(
      'bg-rose-50/60 dark:bg-rose-900/10',
      'text-gray-900 dark:text-gray-100',
      'transition-colors duration-200',
      cellClassName
    ),
    cell: multiRowCell,
  },
];
