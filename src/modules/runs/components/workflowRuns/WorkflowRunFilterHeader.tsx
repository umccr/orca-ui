import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/common/buttons';
import { IconMultipleSelect } from '@/components/common/select';
import { DateRangePicker } from '@/components/common/datepicker';
import { Search } from '@/components/common/search';
import { ButtonGroup } from '@/components/common/buttons';
import { useWorkflowRunStatusCountModel, useWorkflowModel } from '@/api/workflow';
import type { WorkflowModel } from '@/api/workflow';
import { useQueryParams } from '@/hooks/useQueryParams';
import { DEFAULT_NON_PAGINATE_PAGE_SIZE } from '@/utils/constant';
import { keepPreviousData } from '@tanstack/react-query';
import { Tooltip } from '@/components/common/tooltips';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { classNames } from '@/utils/commonUtils';

const WorkflowRunFilterHeader = () => {
  // bugfix: if set array object to state, it will be refresh the page continuously as the object is always new
  // Convert selectedWorkflowTypeIds to selectedWorkflowTypeIdsStr: selectedWorkflowTypeIds.sort().join(',')
  const [selectedWorkflowTypeIdsStr, setSelectedWorkflowTypeIdsStr] = useState<string>('');

  // handle query params changes
  const onChangeParams = () => {
    // handle selectedWorkflowTypeIds changes
    const workflowTypeIds = queryParams.getAll('workflowTypeId');
    setSelectedWorkflowTypeIdsStr(
      workflowTypeIds.length === 0 ? '-1' : workflowTypeIds.sort().join(',')
    );
  };
  const { setQueryParams, clearQueryParams, queryParams, getQueryParams } =
    useQueryParams(onChangeParams);

  useEffect(() => {
    // handle selectedWorkflowTypeIds changes
    const workflowTypeIds = queryParams.getAll('workflowTypeId');
    setSelectedWorkflowTypeIdsStr(
      workflowTypeIds.length === 0 ? '-1' : workflowTypeIds.sort().join(',')
    );
  }, [queryParams]);

  const { data: workflowData } = useWorkflowModel({
    params: {
      query: { page: 1, rowsPerPage: DEFAULT_NON_PAGINATE_PAGE_SIZE },
    },
  });

  const workflowTypeOptions = useMemo(
    () =>
      workflowData
        ? [
            { value: '-1', label: 'All workflows', secondaryLabel: '' },
            ...workflowData.results.map((workflowType: WorkflowModel) => ({
              value: workflowType.orcabusId?.toString().split('.')[1] || '',
              label: workflowType.workflowName,
              secondaryLabel: 'v' + workflowType.workflowVersion,
            })),
          ].sort((a, b) => a.label.localeCompare(b.label))
        : [],
    [workflowData]
  );

  const { data: workflowRunStatusCountData } = useWorkflowRunStatusCountModel({
    params: {
      query: {
        search: getQueryParams().search || undefined,
        workflow__orcabus_id: getQueryParams().workflowTypeId || undefined,
        start_time: getQueryParams().startDate || undefined,
        end_time: getQueryParams().endDate || undefined,
      },
    },
    reactQuery: {
      enabled: true,
      placeholderData: keepPreviousData,
    },
  });

  const workflowRunStatusOptions = useMemo(
    () =>
      workflowRunStatusCountData
        ? [
            ...Object.keys(workflowRunStatusCountData).map((status) => ({
              label: status.charAt(0).toUpperCase() + status.slice(1),
              subLabel:
                workflowRunStatusCountData[
                  status as keyof typeof workflowRunStatusCountData
                ].toString(),
              onClick: () => {
                if (status === 'all') {
                  setQueryParams({ workflowRunStatus: null });
                } else {
                  setQueryParams({ workflowRunStatus: status });
                }
              },
            })),
          ]
        : [
            ...['All', 'Succeeded', 'Aborted', 'Failed', 'Resolved', 'Deprecated'].map(
              (status) => ({
                label: status,
                subLabel: '',
                onClick: () => {
                  if (status === 'All') {
                    setQueryParams({ workflowRunStatus: null });
                  } else {
                    setQueryParams({ workflowRunStatus: status.toLowerCase() });
                  }
                },
              })
            ),
          ],
    [setQueryParams, workflowRunStatusCountData]
  );

  const handleSelectWorkflowType = (selected: (string | number)[]) => {
    if (selected.length === 0 || selected.includes('-1')) {
      setQueryParams({ workflowTypeId: null });
    } else {
      const selectedWorkflowTypeIds = selected.map((id) => id.toString());
      setQueryParams({ workflowTypeId: selectedWorkflowTypeIds });
    }
  };

  const handleTimeChange = (startDate: string | null, endDate: string | null) => {
    setQueryParams({ startDate, endDate });
  };

  return (
    <>
      <div className='flex w-full flex-row items-center justify-between gap-1 p-2 md:flex-row'>
        <div className='w-1/4'>
          <Search
            onSearch={(searchContent) => setQueryParams({ search: searchContent })}
            searchBoxContent={getQueryParams().search || ''}
            hasTooltip
            tooltipText='Available Search Items: workflowRunName, comment, libraryId, orcabusId, workflowName'
          />
        </div>

        <div className='flex flex-row items-center gap-2'>
          <div className='flex-none'>
            <DateRangePicker
              align='left'
              startDate={getQueryParams().startDate}
              endDate={getQueryParams().endDate}
              onTimeChange={handleTimeChange}
            />
          </div>

          <div className='px-0'>
            <IconMultipleSelect
              options={workflowTypeOptions}
              selectedItemValues={selectedWorkflowTypeIdsStr.split(',')}
              onApply={handleSelectWorkflowType}
              hasSelectAllOption={true}
              selectAllOptionValue='-1'
            />
          </div>

          <div className='flex-none px-0'>
            <Tooltip text='Clear all filters' size='small' background='light'>
              <Button
                size='md'
                onClick={() => {
                  clearQueryParams();
                }}
                className={classNames(
                  'inline-flex items-center rounded-sm border border-slate-200 bg-white p-1.5 leading-5 text-gray-400 shadow-xs',
                  'ring-1 ring-gray-300 ring-offset-0 ring-offset-gray-100',
                  'hover:bg-magpie-light-50 hover:text-gray-600',
                  'focus:ring-2 focus:ring-gray-300 focus:ring-offset-0 focus:ring-offset-gray-100 focus:outline-hidden',
                  'transition duration-150 ease-in-out'
                )}
              >
                <XCircleIcon className='h-5 w-5' />
                <span className='sr-only'>Clear all filters</span>
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div>
        <ButtonGroup
          buttonItems={workflowRunStatusOptions}
          selectedItemLabel={queryParams.get('workflowRunStatus') || 'all'}
        />
      </div>
    </>
  );
};

export default WorkflowRunFilterHeader;
