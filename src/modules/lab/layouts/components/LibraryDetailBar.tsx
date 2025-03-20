import { useParams } from 'react-router-dom';
import { Sidebar } from '@/components/common/sidebar';
import { useSuspenseMetadataDetailLibraryModel } from '@/api/metadata';
import { LibraryTableDetails } from '@/modules/lab/components/library/LibraryTableDetails';
import { LibraryLinkTable } from '../../components/library/LibraryLinkTable';
import { Accordion } from '@/components/common/accordion';

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
    <Sidebar position='right' preferenceStorageKey='library-detail-sidebar'>
      <div className='mt-12 min-w-96'>
        <Accordion
          title='Library Details'
          defaultOpen
          chevronPosition='right'
          buttonClassName='border-b  border-gray-200 dark:border-gray-700'
        >
          <LibraryTableDetails libraryDetail={libraryDetailRes} />
        </Accordion>
        <div className='mt-4'></div>

        <Accordion
          title='Other Related Libraries'
          defaultOpen
          chevronPosition='right'
          buttonClassName='border-b  border-gray-200 dark:border-gray-700'
        >
          <LibraryLinkTable libraryDetail={libraryDetailRes} />
        </Accordion>
      </div>
    </Sidebar>
  );
};
