import { LibraryListAPITable } from '@/modules/lab/components/library/LibraryListAPITable';
import { SubjectListAPITable } from '../components/subject/SubjectListAPITable';
import { Fragment, Suspense } from 'react';
import { SpinnerWithText } from '@/components/common/spinner';
import { useQueryParams } from '@/hooks/useQueryParams';
import { IndividualListAPITable } from '../components/individual/IndividualListAPITable';
import { SampleListAPITable } from '../components/sample/SampleListAPITable';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/common/buttons';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { ProjectListAPITable } from '../components/project/ProjectListAPITable';

const selectedClassName =
  'inline-block p-4 text-blue-500 border-b-2 border-blue-500 rounded-t-lg active';
const regularClassName =
  'cursor-pointer	inline-block p-4 border-b-2 border-transparent rounded-t-lg text-gray-500 border-transparent hover:border-gray-200 hover:text-gray-700';

export default function MetadataPage() {
  const { getQueryParams, setQueryParams } = useQueryParams();
  const navigate = useNavigate();
  const queryParams = getQueryParams();

  const currentTabSelection = queryParams.tab;

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
      label: 'project',
      content: <ProjectListAPITable queryParams={passInQueryParams} />,
    },
    {
      label: 'MODEL',
      content: (
        <img src='https://raw.githubusercontent.com/umccr/orcabus/refs/heads/main/lib/workload/stateless/stacks/metadata-manager/docs/schema.drawio.svg' />
      ),
    },
  ];

  if (!currentTabSelection || !tabs.map((tab) => tab.label).includes(currentTabSelection)) {
    return <Navigate to='/lab?tab=library' replace />;
  }

  return (
    <>
      <div className='flex w-full justify-end'>
        <Button
          onClick={() => {
            navigate('./sync');
          }}
          type='green'
          size='sm'
          className='justify-center rounded-md ring-1 ring-gray-300'
        >
          Import
          <DocumentArrowUpIcon className='h-5 w-5' />
        </Button>
      </div>
      <div className='border-b border-gray-200 text-center text-sm font-medium capitalize text-gray-500 dark:text-gray-400'>
        <ul className='-mb-px flex flex-wrap'>
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
              <Fragment key={index}>
                <Suspense fallback={<SpinnerWithText />}>{tab.content}</Suspense>
              </Fragment>
            );
          }
        })}
      </div>
    </>
  );
}
