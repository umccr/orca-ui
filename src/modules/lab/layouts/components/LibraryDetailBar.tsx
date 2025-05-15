import { useParams } from 'react-router-dom';
import { Sidebar } from '@/components/common/sidebar';
import { useQueryMetadataDetailLibraryModel } from '@/api/metadata';
import { LibraryTableDetails } from '@/modules/lab/components/library/LibraryTableDetails';
import { LibraryLinkTable } from '../../components/library/LibraryLinkTable';
import { Accordion } from '@/components/common/accordion';
import { SpinnerWithText } from '@/components/common/spinner';

export const LibraryDetailBar = () => {
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
    return <SpinnerWithText />;
  }

  const libraryDetailData = libraryDetail.data;
  if (!libraryDetailData) {
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
          <LibraryTableDetails libraryDetail={libraryDetailData} />
        </Accordion>
        <div className='mt-4'></div>

        <Accordion
          title='Other Related Libraries'
          defaultOpen
          chevronPosition='right'
          buttonClassName='border-b  border-gray-200 dark:border-gray-700'
        >
          <LibraryLinkTable libraryDetail={libraryDetailData} />
        </Accordion>
      </div>
    </Sidebar>
  );
};
