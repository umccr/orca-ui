import { useParams } from 'react-router-dom';
import { useQueryMetadataDetailLibraryModel } from '@/api/metadata';
import WorkflowRunTable from '@/modules/runs/components/workflowRuns/WorkflowRunTable';
import { classNames } from '@/utils/commonUtils';
import { SpinnerWithText } from '@/components/common/spinner';

export default function LibraryWorkflowRunsPage() {
  const { libraryOrcabusId } = useParams();
  if (!libraryOrcabusId) {
    throw new Error('No library id in URL path!');
  }

  const libraryDetail = useQueryMetadataDetailLibraryModel({
    params: {
      path: {
        orcabusId: libraryOrcabusId,
      },
    },
  });

  if (libraryDetail.isFetching) {
    return <SpinnerWithText text='Loading...' />;
  }

  const libraryDetailData = libraryDetail.data;
  if (!libraryDetailData) {
    throw new Error('No library Id found in metadata!');
  }
  return (
    <div className='w-full'>
      <div className={classNames('my-4 ml-2 text-sm font-medium')}>
        <div className='text-lg font-bold'>Workflow Run</div>
      </div>
      <WorkflowRunTable libraryOrcabusId={libraryOrcabusId} />
    </div>
  );
}
