import { useParams } from 'react-router-dom';
import { LibraryTableDetails } from '../../components/library/LibraryTableDetails';
import { LibraryAnalysisReportTable } from '../../components/library/LibraryAnalysisReportTable';
import { useSuspenseMetadataDetailLibraryModel } from '@/api/metadata';

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
    <div className='flex flex-col 2xl:flex-row'>
      <div className='w-full 2xl:w-96'>
        <div className='font-bold py-3 text-lg'>Library Details</div>

        <LibraryTableDetails libraryDetail={libraryDetailRes} />
      </div>
      <div className='w-full mt-4 2xl:mt-0 2xl:ml-10 2xl:pl-10 2xl:border-l-2 2xl:border-gray-100'>
        <LibraryAnalysisReportTable libraryDetail={libraryDetailRes} />
      </div>
    </div>
  );
}
