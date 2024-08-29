import { useMetadataFullLibraryModel } from '@/api/metadata';
import { JsonToTable } from '@/components/common/json-to-table';
import { useParams } from 'react-router-dom';

export const LibraryTableDetails = () => {
  const { libraryId } = useParams();
  if (!libraryId) {
    throw new Error('No library id in URL path!');
  }
  const fullLibraryModel = useMetadataFullLibraryModel({
    params: { query: { libraryId: libraryId } },
  }).data;

  if (!fullLibraryModel || fullLibraryModel.results.length == 0) {
    throw new Error('No library Id found in metadata!');
  }

  const library = fullLibraryModel.results[0];

  return (
    <JsonToTable
      data={{
        subjectId: library.specimen.subject.subjectId ?? '-',
        specimenId: library.specimen.specimenId ?? '-',
        specimenSource: library.specimen.source ?? '-',
        libraryId: library.libraryId ?? '-',
        phenotype: library.phenotype ?? '-',
        workflow: library.workflow ?? '-',
        quality: library.quality ?? '-',
        type: library.type ?? '-',
        assay: library.assay ?? '-',
      }}
    />
  );
};