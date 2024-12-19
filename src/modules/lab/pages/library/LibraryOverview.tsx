import { Link, useParams } from 'react-router-dom';
import { LibraryTableDetails } from '../../components/library/LibraryTableDetails';
import { LibraryAnalysisReportTable } from '../../components/library/LibraryAnalysisReportTable';
import { useSuspenseMetadataDetailLibraryModel } from '@/api/metadata';
import WorkflowRunTable from '@/modules/runs/components/workflowRuns/WorkflowRunTable';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
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
      <div className='w-full min-w-[575px] xl:w-96'>
        <div className='pb-3 text-lg font-bold xl:pt-3'>Library Details</div>
        <LibraryTableDetails libraryDetail={libraryDetailRes} />

        <Link
          to={`/runs/workflow?search=${
            // WFM-FIXME: Library Orcabus Prefix
            libraryOrcabusId.split('.').length > 1
              ? libraryOrcabusId.split('.')[1]
              : libraryOrcabusId.split('.')[0]
          }`}
          className={classNames('ml-2 mt-4 text-sm font-medium hover:text-blue-700')}
        >
          <div className='flex flex-row items-center'>
            <div className='text-lg font-bold'>Workflow Run</div>
            <div className='ml-2'>
              <DocumentMagnifyingGlassIcon className='h-5 w-5' />
            </div>
          </div>
        </Link>
        <WorkflowRunTable libraryOrcabusId={libraryOrcabusId} />
      </div>

      <div className='mt-4 w-full xl:ml-10 xl:mt-0 xl:border-l-2 xl:border-gray-100 xl:pl-10'>
        <LibraryAnalysisReportTable libraryDetail={libraryDetailRes} />
      </div>
    </div>
  );
}
