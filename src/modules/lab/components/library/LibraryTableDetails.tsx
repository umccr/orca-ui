import { FC } from 'react';
import { JsonToTable } from '@/components/common/json-to-table';
import { components } from '@/api/types/metadata';
import { classNames } from '@/utils/commonUtils';
import { RedirectLink } from '@/components/common/link';
type LibraryTableDetailsProps = {
  libraryDetail: components['schemas']['LibraryDetail'];
};

export const LibraryTableDetails: FC<LibraryTableDetailsProps> = ({ libraryDetail: library }) => {
  return (
    <div>
      <JsonToTable
        className='shadow-none'
        data={{
          'Library ID': library.libraryId ?? '-',
          'Individual ID': library.subject.individualSet.map((individual) => (
            <RedirectLink
              key={individual.orcabusId}
              to={`/lab/?tab=subject&individualId=${individual.individualId}`}
            >
              {individual.individualId ?? '-'}
            </RedirectLink>
          )),
          'Subject ID': (
            <RedirectLink to={`/lab/?tab=subject&orcabusId=${library.subject.orcabusId}`}>
              {library.subject.subjectId ?? '-'}
            </RedirectLink>
          ),
          'Sample ID': (
            <RedirectLink
              to={`/lab/?tab=sample&orcabusId=${library.sample.orcabusId}`}
              className={classNames('text-blue-500 hover:text-blue-700')}
            >
              {library.sample.sampleId ?? '-'}
            </RedirectLink>
          ),
          'Sample Source': library.sample.source ?? '-',
          'External Sample ID': library.sample.externalSampleId ?? '-',
          Phenotype: library.phenotype ?? '-',
          Workflow: library.workflow ?? '-',
          Quality: library.quality ?? '-',
          Type: library.type ?? '-',
          Assay: library.assay ?? '-',
          'Override Cycles': library.overrideCycles ?? '-',
          Project: library.projectSet.map((project) => (
            <RedirectLink
              key={project.orcabusId}
              to={`/lab/?tab=library&projectId=${project.projectId}`}
              className={classNames('text-blue-500 hover:text-blue-700')}
            >
              {project.projectId ?? '-'}
            </RedirectLink>
          )),
        }}
      />
    </div>
  );
};
