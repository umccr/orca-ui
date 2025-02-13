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
          'Library Id': library.libraryId ?? '-',
          'Subject Id': (
            <Link
              to={`/lab/?tab=subject&orcabusId=${library.subject.orcabusId}`}
              className={classNames('text-blue-500 hover:text-blue-700')}
            >
              {library.subject.subjectId ?? '-'}
            </Link>
          ),
          'Sample Id': (
            <Link
              to={`/lab/?tab=sample&orcabusId=${library.sample.orcabusId}`}
              className={classNames('text-blue-500 hover:text-blue-700')}
            >
              {library.sample.sampleId ?? '-'}
            </Link>
          ),
          'External Sample Id': library.sample.externalSampleId ?? '-',
          'Sample Source': library.sample.source ?? '-',
          Phenotype: library.phenotype ?? '-',
          Workflow: library.workflow ?? '-',
          Quality: library.quality ?? '-',
          Type: library.type ?? '-',
          Assay: library.assay ?? '-',
          Project: library.projectSet.map((project) => (
            <Link
              key={project.orcabusId}
              to={`/lab/?tab=library&project_id=${project.projectId}`}
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
