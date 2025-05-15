import { useParams } from 'react-router-dom';
import { LibraryAnalysisReportTable } from '../../components/library/LibraryAnalysisReportTable';
import { useQueryMetadataDetailLibraryModel } from '@/api/metadata';
import { SpinnerWithText } from '@/components/common/spinner';

export default function LibraryOverviewPage() {
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
      <LibraryAnalysisReportTable libraryDetail={libraryDetailData} />
    </div>
  );
}
