import { useQueryParams } from '@/hooks/useQueryParams';
import { LIBRARY_FILTER_KEY, LibraryAPITable } from './components/LibraryAPITable';
import { SUBJECT_ORDERING_KEY, SubjectAPITable } from './components/SubjectAPITable';

export default function LabPage() {
  const { getQueryParams } = useQueryParams();

  const queryParam = getQueryParams();

  const isFilterLibraryApplied = !!Object.keys(queryParam).find((key) =>
    LIBRARY_FILTER_KEY.includes(key)
  );
  const isSubjectSortApplied = SUBJECT_ORDERING_KEY.find(
    (key) => queryParam['ordering'] && queryParam['ordering'].endsWith(key)
  );

  if (isFilterLibraryApplied && isSubjectSortApplied) {
    throw new Error('Incorrect filter applied');
  }

  return (
    <>
      {/* If there are filters/sort from Library mode, we will use the (full) Library API, else (full) Subject API used */}
      {isFilterLibraryApplied && !isSubjectSortApplied ? <LibraryAPITable /> : <SubjectAPITable />}
    </>
  );
}
