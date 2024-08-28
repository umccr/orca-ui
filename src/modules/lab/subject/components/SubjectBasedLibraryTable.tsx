import { useMetadataFullSubjectModel } from '@/api/metadata';
import { Link, useParams } from 'react-router-dom';
import { components } from '@/api/types/metadata';
import { Table } from '@/components/tables';
import { Column } from '@/components/tables/Table';
import { classNames } from '@/utils/commonUtils';

export const SubjectBasedLibraryTable = () => {
  const { subjectId } = useParams();

  if (!subjectId) {
    throw new Error('No subject id found!');
  }

  const fullSubjectModel = useMetadataFullSubjectModel({
    params: { query: { subjectId: subjectId } },
  });

  const data = fullSubjectModel.data;

  if (!data || data?.pagination.count == 0) {
    throw new Error('No subject data found!');
  }
  const libraryArray = convertLibraryData(data.results[0]);

  const tableColumn: Column[] = [];
  for (const element in libraryArray[0]) {
    if (element === 'libraryId') {
      tableColumn.push({
        header: 'LibraryId',
        accessor: element,
        cell: (data) => (
          <Link
            className={classNames(
              'ml-2 text-sm capitalize font-medium hover:text-blue-700 text-blue-500'
            )}
            to={`/lab/library/${data}`}
          >
            {data as string}
          </Link>
        ),
      });
      continue;
    }
    tableColumn.push({ header: element, accessor: element });
  }

  return (
    <div>
      <Table
        tableHeader={`Subject - ${subjectId}`}
        tableData={libraryArray}
        columns={tableColumn}
      />
    </div>
  );
};

const convertLibraryData = (data: components['schemas']['SubjectFull']) => {
  const lib: Record<string, string>[] = [];
  for (const specimen of data.specimenSet) {
    for (const library of specimen.librarySet) {
      lib.push({
        specimenId: specimen.specimenId ?? '-',
        source: specimen.source ?? '-',
        libraryId: library.libraryId ?? '-',
        phenotype: library.phenotype ?? '-',
        workflow: library.workflow ?? '-',
        quality: library.quality ?? '-',
        type: library.type ?? '-',
        assay: library.assay ?? '-',
        coverage: library.coverage?.toString() ?? '-',
      });
    }
  }
  return lib;
};
