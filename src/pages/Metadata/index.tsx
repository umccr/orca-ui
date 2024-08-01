import Card from '@/components/layouts/cards';
import { Suspense } from 'react';
import { SubjectTable } from './components/SubjectTable';
import DetailedErrorBoundary from '@/components/common/error';
import SpinnerWithText from '@/components/common/spinnerWithText';

export default function MetadataPage() {
  return (
    <Card>
      <Suspense fallback={<SpinnerWithText text='Loading metadata table ...' />}>
        <DetailedErrorBoundary errorTitle='Unable to load metadata table'>
          <SubjectTable />
        </DetailedErrorBoundary>
      </Suspense>
    </Card>
  );
}
