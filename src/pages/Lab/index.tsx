import { Card } from '@/components/layouts/cards';
import { Suspense } from 'react';
import { SubjectTable } from './components/SubjectTable';
import { DetailedErrorBoundary } from '@/components/common/error';
import { SpinnerWithText } from '@/components/common/spinner';

export default function LabPage() {
  return (
    <Card>
      <Suspense fallback={<SpinnerWithText text='Loading lab table ...' />}>
        <DetailedErrorBoundary errorTitle='Unable to load lab table'>
          <SubjectTable />
        </DetailedErrorBoundary>
      </Suspense>
    </Card>
  );
}
