import { useParams } from 'react-router-dom';
import { LibraryTableDetails } from '../../components/library/LibraryTableDetails';
import { LibraryAnalysisReportTable } from '../../components/library/LibraryAnalysisReportTable';
import { useSuspenseMetadataDetailLibraryModel } from '@/api/metadata';
import WorkflowRunTable from '@/modules/runs/components/workflowRuns/WorkflowRunTable';
import { classNames } from '@/utils/commonUtils';

export default function LibraryOverviewPage() {
  const { libraryOrcabusId } = useParams();
  if (!libraryOrcabusId) {
    throw new Error('No library id in URL path!');
  }

  const libraryDetailRes = useSuspenseMetadataDetailLibraryModel({
    params: {
      path: {
        orcabusId: libraryOrcabusId,
      },
    },
  }).data;

  if (!libraryDetailRes) {
    throw new Error('No library Id found in metadata!');
  }
  return (
    <div className='flex flex-col xl:flex-row'>
      <div className='w-full xl:w-96 min-w-[575px]'>
        <div className='font-bold xl:pt-3 pb-3 text-lg'>Library Details</div>
        <LibraryTableDetails libraryDetail={libraryDetailRes} />

        <div className={classNames('ml-2 text-sm font-medium hover:text-blue-700 mt-4')}>
          <div className='font-bold text-lg'>Workflow Run</div>
        </div>
        <WorkflowRunTable libraryOrcabusId={libraryOrcabusId} />
      </div>

      <div className='w-full mt-4 xl:mt-0 xl:ml-10 xl:pl-10 xl:border-l-2 xl:border-gray-100'>
        <LibraryAnalysisReportTable libraryDetail={libraryDetailRes} />
      </div>
    </div>
  );
}
