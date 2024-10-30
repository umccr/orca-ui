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
            { value: '-1', label: 'All workflow', secondaryLabel: '' },

            ...workflowData.results.map((workflowType: WorkflowModel) => ({
              value: workflowType.orcabusId.toString(),
              label: workflowType.workflowName,
              secondaryLabel: 'v' + workflowType.workflowVersion,
            })),
          ]
        : [],
    [workflowData]
  );

  const { data: workflowRunStatusCountData } = useWorkflowRunStatusCountModel({
    params: {},
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
            {
              label: 'All',
              subLabel: '',
              onClick: () => {
                setQueryParams({ workflowRunStatus: null });
              },
            },
            {
              label: 'Succeeded',
              subLabel: '',
              onClick: () => {
                setQueryParams({ workflowRunStatus: 'succeeded' });
              },
            },
            {
              label: 'Aborted',
              subLabel: '',
              onClick: () => {
                setQueryParams({ workflowRunStatus: 'aborted' });
              },
            },
            {
              label: 'Failed',
              subLabel: '',
              onClick: () => {
                setQueryParams({ workflowRunStatus: 'failed' });
              },
            },
            {
              label: 'Resolved',
              subLabel: '',
              onClick: () => {
                setQueryParams({ workflowRunStatus: 'resolved' });
              },
            },
            {
              label: 'Ongoing',
              subLabel: '',
              onClick: () => {
                setQueryParams({ workflowRunStatus: 'ongoing' });
              },
            },
          ],
    [setQueryParams, workflowRunStatusCountData]
  );

  const handleSelectWorkflowType = (selected: (string | number)[]) => {
    if (selected.length === 0 || selected.includes('-1')) {
      setQueryParams({ workflowTypeId: null });
    } else {
      const selectedWorkflowTypeIds = selected.map((id) => id.toString().split('.')[1]);
      console.log(selectedWorkflowTypeIds, selected);
      setQueryParams({ workflowTypeId: selectedWorkflowTypeIds });
    }
  };

  const handleTimeChange = (startDate: string | null, endDate: string | null) => {
    setQueryParams({ startDate, endDate });
  };

  return (
    <>
      <div className='w-full flex flex-row gap-1  md:flex-row items-center  justify-between p-2'>
        <div>
          <Search
            onSearch={(searchContent) => setQueryParams({ search: searchContent })}
            searchBoxContent={getQueryParams().search || ''}
            hasTooltip
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

          <div className='px-0 flex-none'>
            <Button
              size='md'
              onClick={() => {
                clearQueryParams(['tab']);
              }}
              className=' text-gray-400 hover:text-white'
            >
              Clear all
            </Button>
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
