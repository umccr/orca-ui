export type Filter = {
  key: string;
  operator: string;
  value: string;
};

type SortDirectionType = { currentSort: string | undefined; key: string };

export const getMartSortDirection = ({ currentSort, key }: SortDirectionType) => {
  if (!currentSort || !currentSort.startsWith(key)) {
    return undefined;
  }

  if (currentSort?.endsWith('DESC')) {
    return 'desc';
  }

  return 'asc';
};

export const getMartSortValue = (currentSort: string | undefined, key: string) => {
  const currentSortDirection = getMartSortDirection({ currentSort, key });

  // Going the opposite here from the current sort direction
  return `${key}_${currentSortDirection === 'desc' ? 'ASC' : 'DESC'}`;
};
