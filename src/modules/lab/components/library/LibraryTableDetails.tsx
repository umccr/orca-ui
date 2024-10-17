import { FC } from 'react';
import { JsonToTable } from '@/components/common/json-to-table';
import { components } from '@/api/types/metadata';

type LibraryTableDetailsProps = {
  libraryDetail: components['schemas']['LibraryDetail'];
};

export const LibraryTableDetails: FC<LibraryTableDetailsProps> = ({ libraryDetail: library }) => {
  return (
    <div>
      <JsonToTable
        data={{
          'Library Id': library.libraryId ?? '-',
          'Subject Id': library.subject.subjectId ?? '-',
          'Sample Id': library.sample.sampleId ?? '-',
          'External Sample Id': library.sample.externalSampleId ?? '-',
          'Sample Source': library.sample.source ?? '-',
          Phenotype: library.phenotype ?? '-',
          Workflow: library.workflow ?? '-',
          Quality: library.quality ?? '-',
          Type: library.type ?? '-',
          Assay: library.assay ?? '-',
        }}
      />
    </div>
  );
};
