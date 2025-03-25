import { useSequenceRunContext } from './SequenceRunContext';
import { useWorkflowRunStatusCountModel } from '@/api/workflow';
import { SpinnerWithText } from '@/components/common/spinner';
import { classNames } from '@/utils/commonUtils';

const SequenceRunWorkflowRunsStats = () => {
  const { sequenceRunDetail } = useSequenceRunContext();

  const { data: workflowRunsCount, isLoading: isLoadingWorkflowRuns } =
    useWorkflowRunStatusCountModel({
      params: {
        query: {
          libraries__libraryId: sequenceRunDetail?.libraries,
        },
      },
    });

  if (isLoadingWorkflowRuns) {
    return (
      <div className='flex h-full items-center justify-center'>
        <SpinnerWithText text='Loading workflow runs...' />
      </div>
    );
  }

  if (!workflowRunsCount) {
    return (
      <div className='flex h-full items-center justify-center rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900'>
        <p className='text-sm text-gray-500 dark:text-gray-400'>No workflow runs found</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-7 gap-2 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900'>
      {Object.keys(workflowRunsCount).map((key, idx) => (
        <div
          key={idx}
          className={classNames(
            'col-span-1 flex flex-col justify-center gap-1 px-4',
            idx !== 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''
          )}
        >
          <h3 className='text-sm font-medium text-gray-500 dark:text-gray-400'>
            {key.toUpperCase()}
          </h3>
          <p className='mt-1 text-lg font-medium text-gray-900 dark:text-white'>
            {workflowRunsCount[key as keyof typeof workflowRunsCount]}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SequenceRunWorkflowRunsStats;
