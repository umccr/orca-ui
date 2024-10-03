import { SpinnerWithText } from '@/components/common/spinner';
import { Suspense, useState } from 'react';
import { FileAPITable, getTableColumn, SearchBox } from '../components/FileAPITable';

export default function FilesPage() {
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});

  return (
    <>
      <SearchBox
        placeholder='Object key search (support wildcard)'
        onSearch={(s) => {
          setQueryParams((p) => ({ ...p, key: s }));
        }}
      />

      {/* Only show the table if the key filter exist! */}
      {!!queryParams?.key && (
        <Suspense fallback={<SpinnerWithText className='mt-4' text='Fetching related files ...' />}>
          <FileAPITable
            additionalQueryParam={queryParams}
            tableColumn={getTableColumn({ isHideKeyPrefix: false })}
          />
        </Suspense>
      )}
    </>
  );
}
