import { FC } from 'react';
import { JsonToTable } from '@/components/common/json-to-table';
import { components } from '@/api/types/metadata';

type LibraryTableDetailsProps = {
  libraryDetail: components['schemas']['LibraryDetail'];
};

export const LibraryTableDetails: FC<LibraryTableDetailsProps> = ({ libraryDetail: library }) => {
  return (
    <div>
      <div className='font-bold py-3 text-lg'>Library Details</div>
      <JsonToTable
        data={{
          subjectId: library.subject.subjectId ?? '-',
          sampleId: library.sample.sampleId ?? '-',
          externalSampleId: library.sample.externalSampleId ?? '-',
          sampleSource: library.sample.source ?? '-',
          libraryId: library.libraryId ?? '-',
          phenotype: library.phenotype ?? '-',
          workflow: library.workflow ?? '-',
          quality: library.quality ?? '-',
          type: library.type ?? '-',
          assay: library.assay ?? '-',
        }}
      />
    </div>
  );
};
