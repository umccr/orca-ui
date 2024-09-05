import React from 'react';
import { useMetadataFullLibraryModel } from '@/api/metadata';
import { components } from '@/api/types/metadata';
import { MetadataTable } from './MetadataTable';
import { useQueryParams } from '@/hooks/useQueryParams';

export const LIBRARY_FILTER_KEY = [
  'coverage__lte',
  'coverage__gte',
  'libraryId',
  'assay',
  'projectName',
  'projectOwner',
  'phenotype',
  'quality',
  'type',
  'workflow',
];

export const LibraryAPITable = () => {
  const { getPaginationParams, getQueryParams } = useQueryParams();

  const fullLibraryModel = useMetadataFullLibraryModel({
    params: { query: { ...getQueryParams(), ...getPaginationParams() } },
  });
  const data = fullLibraryModel.data;
  if (!data) {
    throw new Error('No subject data found!');
  }
  const tableData = processLibraryFullResults(data.results);
  return <MetadataTable data={tableData} pagination={data.pagination} metadataApiUsed='library' />;
};

/**
 * Process library results record to table recognisable data
 * @param data the results returned from the API
 * @returns
 */
const processLibraryFullResults = (data: components['schemas']['LibraryFull'][]) => {
  return data.map((library) => {
    const rec: Record<string, unknown[]> = {
      specimenId: [],
      source: [],
      libraryId: [],
      phenotype: [],
      workflow: [],
      quality: [],
      type: [],
      assay: [],
      coverage: [],
    };

    rec.libraryId.push(library.libraryId ?? '-');
    rec.phenotype.push(library.phenotype ?? '-');
    rec.workflow.push(library.workflow ?? '-');
    rec.quality.push(library.quality ?? '-');
    rec.type.push(library.type ?? '-');
    rec.assay.push(library.assay ?? '-');
    rec.coverage.push(library.coverage?.toString() ?? '-');

    rec.specimenId.push(library.specimen.specimenId ?? '-');
    rec.source.push(library.specimen.source ?? '-');

    return {
      subjectId: {
        orcabus_id: library.specimen.subject.orcabusId,
        subjectId: library.specimen.subject.subjectId,
      },
      ...rec,
    };
  });
};
