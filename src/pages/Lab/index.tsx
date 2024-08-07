import { Suspense } from 'react';
import { SubjectTable } from './components/SubjectTable';
import { DetailedErrorBoundary } from '@/components/common/error';
import { SpinnerWithText } from '@/components/common/spinner';

export default function LabPage() {
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
