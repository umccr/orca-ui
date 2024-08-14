import React from 'react';
import { useMetadataFullLibraryModel } from '@/api/metadata';
import { JsonToTable } from '@/components/common/json-to-table';
import { useParams } from 'react-router-dom';

export const LibraryTableDetails = () => {
  const { libraryId } = useParams();
  if (!libraryId) {
    throw new Error('No library id in URL path!');
  }
  const fullLibraryModel = useMetadataFullLibraryModel({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: { query: { internal_id: libraryId } as any },
  }).data;

  if (!fullLibraryModel || fullLibraryModel.results.length == 0) {
    throw new Error('No library Id found in metadata!');
  }

  const library = fullLibraryModel.results[0];

  return (
    <JsonToTable
      data={{
        subjectId: library.specimen.subject.internal_id ?? '-',
        specimenId: library.specimen.internal_id ?? '-',
        specimenSource: library.specimen.source ?? '-',
        libraryId: library.internal_id ?? '-',
        phenotype: library.phenotype ?? '-',
        workflow: library.workflow ?? '-',
        quality: library.quality ?? '-',
        type: library.type ?? '-',
        assay: library.assay ?? '-',
      }}
    />
  );
};
