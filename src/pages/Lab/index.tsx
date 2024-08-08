import { Suspense } from 'react';
import { SubjectTable } from './components/SubjectTable';
import { DetailedErrorBoundary } from '@/components/common/error';
import { SpinnerWithText } from '@/components/common/spinner';
import MainArea from '@/components/layouts/MainArea';

export default function LabPage() {
  return (
    <>
      <Suspense fallback={<SpinnerWithText text='Loading metadata table ...' />}>
        <DetailedErrorBoundary errorTitle='Unable to load metadata table'>
          <MainArea>
            <SubjectTable />
          </MainArea>
        </DetailedErrorBoundary>
      </Suspense>
    </>
  );
}
