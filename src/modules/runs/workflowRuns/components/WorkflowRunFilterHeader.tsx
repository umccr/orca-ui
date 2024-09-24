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
  const [searchBoxContent, setSearchBoxContent] = useState<string>('');
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectWorkflowStatus, setSelectWorkflowStatus] = useState<
    'succeeded' | 'failed' | 'aborted' | 'ongoing' | null
  >(null);

  // bugfix: if set array object to state, it will be refresh the page continuously as the object is always new
  // Convert selectedWorkflowTypeIds to selectedWorkflowTypeIdsStr: selectedWorkflowTypeIds.sort().join(',')
  const [selectedWorkflowTypeIdsStr, setSelectedWorkflowTypeIdsStr] = useState<string>('');

  // handle query params changes
  const onChangeParams = () => {
    setSearchBoxContent(queryParams.get('search') as string);
    setStartDate(queryParams.get('startDate'));
    setEndDate(queryParams.get('endDate'));

    // handle selectedWorkflowTypeIds changes
    const workflowTypeIds = queryParams.getAll('workflowTypeId');
    setSelectedWorkflowTypeIdsStr(
      workflowTypeIds.length === 0 ? '-1' : workflowTypeIds.sort().join(',')
    );

    // handle selectedworkflowRunStatus changes
    setSearchBoxContent(queryParams.get('search') as string);
    setSelectWorkflowStatus(
      queryParams.get('workflowRunStatus') as 'succeeded' | 'failed' | 'aborted' | 'ongoing' | null
    );
  };
  const { setQueryParams, clearQueryParams, queryParams } = useQueryParams(onChangeParams);

  useEffect(() => {
    setSearchBoxContent(queryParams.get('search') as string);
    setStartDate(queryParams.get('startDate'));
    setEndDate(queryParams.get('endDate'));

    // handle selectedWorkflowTypeIds changes
    const workflowTypeIds = queryParams.getAll('workflowTypeId');
    setSelectedWorkflowTypeIdsStr(
      workflowTypeIds.length === 0 ? '-1' : workflowTypeIds.sort().join(',')
    );

    // setSelectedWorkflowTypeIdsStr(queryParams.getAll('workflowTypeId');
    setSelectWorkflowStatus(
      queryParams.get('workflowRunStatus') as 'succeeded' | 'failed' | 'aborted' | 'ongoing' | null
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
              value: workflowType.id.toString(),
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
        : [],
    [setQueryParams, workflowRunStatusCountData]
  );

  const handleSelectWorkflowType = (selected: (string | number)[]) => {
    if (selected.length === 0 || selected.includes('-1')) {
      setQueryParams({ workflowTypeId: null });
    } else {
      setQueryParams({ workflowTypeId: selected });
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
            searchBoxContent={searchBoxContent}
            hasTooltip
          />
        </div>

        <div className='flex flex-row items-center gap-2'>
          <div className='flex-none'>
            <DateRangePicker
              align='left'
              startDate={startDate}
              endDate={endDate}
              onTimeChange={handleTimeChange}
            />
          </div>
          {/* <div className='w-fit px-2 flex-none'>
          <Toggle
            label='ongoing only'
            onChange={handleOngoingOnlyToggle}
            checked={isToggleChecked}
          />
        </div> */}
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
                clearQueryParams();
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
          selectedItemLabel={selectWorkflowStatus || 'all'}
        />
      </div>
    </>
  );
};

export default WorkflowRunFilterHeader;
