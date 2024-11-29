import { SpinnerWithText } from '@/components/common/spinner';
import { Suspense } from 'react';
import { FileAPITable, getTableColumn, SearchBox } from '../components/FileAPITable';
import { useQueryParams } from '@/hooks/useQueryParams';

export default function FilesPage() {
  const { setQueryParams, getQueryParams } = useQueryParams();

  const searchKey = getQueryParams().key;

  return (
    <>
      <SearchBox
        initValue={searchKey}
        placeholder='Object key search (support wildcard)'
        onSearch={(s) => {
          setQueryParams({ key: s });
        }}
      />

      {/* Only show the table if the key filter exist! */}
      {searchKey && (
        <Suspense fallback={<SpinnerWithText className='mt-4' text='Fetching related files ...' />}>
          <FileAPITable
            additionalQueryParam={{
              key: `*${searchKey}*`,
            }}
            tableColumn={getTableColumn({ isHideKeyPrefix: false })}
          />
        </Suspense>
      )}
    </>
  );
}
