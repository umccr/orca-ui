import { FC } from 'react';
import { JsonToTable } from '@/components/common/json-to-table';
import { components } from '@/api/types/metadata';
import { Link } from 'react-router-dom';
import { classNames } from '@/utils/commonUtils';

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
            <Link
              key={individual.orcabusId}
              to={`/lab/?tab=subject&individualId=${individual.individualId}`}
              className={classNames('text-blue-500 hover:text-blue-700')}
            >
              {individual.individualId ?? '-'}
            </Link>
          )),
          'Subject ID': (
            <Link
              to={`/lab/?tab=subject&orcabusId=${library.subject.orcabusId}`}
              className={classNames('text-blue-500 hover:text-blue-700')}
            >
              {library.subject.subjectId ?? '-'}
            </Link>
          ),
          'Sample ID': (
            <Link
              to={`/lab/?tab=sample&orcabusId=${library.sample.orcabusId}`}
              className={classNames('text-blue-500 hover:text-blue-700')}
            >
              {library.sample.sampleId ?? '-'}
            </Link>
          ),
          'Sample Source': library.sample.source ?? '-',
          'External Sample ID': library.sample.externalSampleId ?? '-',
          Phenotype: library.phenotype ?? '-',
          Workflow: library.workflow ?? '-',
          Quality: library.quality ?? '-',
          Type: library.type ?? '-',
          Assay: library.assay ?? '-',
          Project: library.projectSet.map((project) => (
            <Link
              key={project.orcabusId}
              to={`/lab/?tab=library&projectId=${project.projectId}`}
              className={classNames('text-blue-500 hover:text-blue-700')}
            >
              {project.projectId ?? '-'}
            </Link>
          )),
        }}
      />
    </div>
  );
};
