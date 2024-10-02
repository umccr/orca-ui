import { LibraryListAPITable } from '@/modules/lab/components/library/LibraryListAPITable';
import { SubjectListAPITable } from '../components/subject/SubjectListAPITable';
import { Suspense } from 'react';
import { SpinnerWithText } from '@/components/common/spinner';
import { useQueryParams } from '@/hooks/useQueryParams';
import { IndividualListAPITable } from '../components/individual/IndividualListAPITable';
import { SampleListAPITable } from '../components/sample/SampleListAPITable';
import { Navigate } from 'react-router-dom';

const selectedClassName =
  'inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500';
const regularClassName =
  'cursor-pointer	inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300';

export default function MetadataPage() {
  const { getQueryParams, setQueryParams } = useQueryParams();

  const queryParams = getQueryParams();

  const currentTabSelection = queryParams.tab;

  if (!currentTabSelection) {
    return <Navigate to='/lab?tab=library' replace />;
  }

  // sanitise to remove tab from query params
  const passInQueryParams = { ...queryParams };
  delete passInQueryParams.tab;

  const tabs = [
    {
      label: 'library',
      content: <LibraryListAPITable queryParams={passInQueryParams} />,
    },
    {
      label: 'subject',
      content: <SubjectListAPITable queryParams={passInQueryParams} />,
    },
    {
      label: 'individual',
      content: <IndividualListAPITable queryParams={passInQueryParams} />,
    },
    {
      label: 'sample',
      content: <SampleListAPITable queryParams={passInQueryParams} />,
    },
    {
      label: 'MODEL',
      content: (
        <img src='https://raw.githubusercontent.com/umccr/orcabus/refs/heads/main/lib/workload/stateless/stacks/metadata-manager/docs/schema.drawio.svg' />
      ),
    },
  ];

  return (
    <>
      <div className='text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700'>
        <ul className='flex flex-wrap -mb-px'>
          {tabs.map((tab, index) => {
            const isSelected = currentTabSelection === tab.label;
            return (
              <li key={index} className='me-2'>
                <div
                  onClick={() => {
                    setQueryParams({ tab: tab.label }, true);
                  }}
                  className={isSelected ? selectedClassName : regularClassName}
                >
                  {tab.label}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className='mt-4'>
        {tabs.map((tab, index) => {
          if (currentTabSelection === tab.label) {
            return (
              <div key={index}>
                <Suspense fallback={<SpinnerWithText />}>{tab.content}</Suspense>
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );
}
