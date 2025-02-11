import { useParams } from 'react-router-dom';
import { Sidebar } from '@/components/common/sidebar';
import { useSuspenseMetadataDetailLibraryModel } from '@/api/metadata';
import { LibraryTableDetails } from '@/modules/lab/components/library/LibraryTableDetails';

export const LibraryDetailBar = () => {
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
    <Sidebar position='right'>
      <div className='mt-20'>
        <LibraryTableDetails libraryDetail={libraryDetailRes} />
      </div>
    </Sidebar>
  );
};
