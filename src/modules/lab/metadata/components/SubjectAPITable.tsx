import React from 'react';
import { useMetadataFullSubjectModel } from '@/api/metadata';
import { components } from '@/api/types/metadata';
import { useQueryParams } from '@/hooks/useQueryParams';
import { MetadataTable } from './MetadataTable';

export const SUBJECT_ORDERING_KEY = ['subject_id'];

export const SubjectAPITable = () => {
  const { getPaginationParams, getQueryParams } = useQueryParams();

  const fullSubjectModel = useMetadataFullSubjectModel({
    params: { query: { ...getQueryParams(), ...getPaginationParams() } },
  });
  const data = fullSubjectModel.data;
  if (!data) {
    throw new Error('No subject data found!');
  }
  const tableData = processSubjectFullResults(data.results);
  return <MetadataTable data={tableData} pagination={data.pagination} metadataApiUsed='subject' />;
};

/**
 * Process subject results record to table recognisable data
 * @param data the results returned from the API
 * @returns
 */
const processSubjectFullResults = (data: components['schemas']['SubjectFull'][]) => {
  return data.map((subject) => {
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

    for (const specimen of subject.specimenSet) {
      for (const library of specimen.librarySet) {
        rec.specimenId.push(specimen.specimenId ?? '-');
        rec.source.push(specimen.source ?? '-');
        rec.libraryId.push(library.libraryId ?? '-');
        rec.phenotype.push(library.phenotype ?? '-');
        rec.workflow.push(library.workflow ?? '-');
        rec.quality.push(library.quality ?? '-');
        rec.type.push(library.type ?? '-');
        rec.assay.push(library.assay ?? '-');
        rec.coverage.push(library.coverage?.toString() ?? '-');
      }
    }

    return {
      subjectId: {
        orcabus_id: subject.orcabusId,
        subjectId: subject.subjectId,
      },
      ...rec,
    };
  });
};
