import { Suspense } from 'react';
import { SubjectTable } from './components/SubjectTable';
import { DetailedErrorBoundary } from '@/components/common/error';
import { SpinnerWithText } from '@/components/common/spinner';

export default function MetadataPage() {
  return (
    <>
      <Suspense fallback={<SpinnerWithText text='Loading metadata table ...' />}>
        <DetailedErrorBoundary errorTitle='Unable to load metadata table'>
          <SubjectTable />
        </DetailedErrorBoundary>
      </Suspense>
    </>
  );
}
