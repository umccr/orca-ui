import { useParams } from 'react-router-dom';
import { LibraryTableDetails } from '../../components/library/LibraryTableDetails';
import { LibraryAnalysisReportTable } from '../../components/library/LibraryAnalysisReportTable';
import { useSuspenseMetadataLibraryModel } from '@/api/metadata';

export default function LibraryOverviewPage() {
  const { libraryId } = useParams();
  if (!libraryId) {
    throw new Error('No library id in URL path!');
  }

  const libraryDetailRes = useSuspenseMetadataLibraryModel({
    params: { query: { libraryId: libraryId } },
  }).data;

  if (!libraryDetailRes || libraryDetailRes?.results.length == 0) {
    throw new Error('No library Id found in metadata!');
  }
  const libraryDetail = libraryDetailRes.results[0];
  return (
    <div className='flex flex-col 2xl:flex-row'>
      <div className='w-full 2xl:w-96'>
        <LibraryTableDetails libraryDetail={libraryDetail} />
      </div>
      <div className='w-full mt-4 2xl:mt-0 2xl:ml-10 2xl:pl-10 2xl:border-l-2 2xl:border-gray-100'>
        <LibraryAnalysisReportTable libraryDetail={libraryDetail} />
      </div>
    </div>
  );
}
