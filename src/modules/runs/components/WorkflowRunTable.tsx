import { useWorkflowRunListModel, useWorkflowModel } from '@/api/workflow';
import { useEffect, useState, useMemo, Suspense } from 'react';

import { useQueryParams } from '@/hooks/useQueryParams';
import { DEFAULT_NON_PAGINATE_PAGE_SIZE } from '@/utils/constant';

// import { SelectItems } from '@/components/common/select';
import { WorkflowRunDetailsDrawer } from './WorkflowRunDetailsDrawer';

import WorkflowRunTableHeader from './WorkflowRunTableHeader';
import WorkflowRunTable from '../tables/WorkflowRunTable';

import type { WorkflowModel } from '@/api/workflow';

const WorkflowRunsTable = () => {
  const [searchBoxContent, setSearchBoxContent] = useState<string>('');

  const [selectWorkflowStatus, setSelectWorkflowStatus] = useState<
    'succeeded' | 'failed' | 'aborted' | 'ongoing' | null
  >(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // bugfix: if set array object to state, it will be refresh the page continuously as the object is always new
  // Convert selectedWorkflowTypeIds to selectedWorkflowTypeIdsStr: selectedWorkflowTypeIds.sort().join(',')
  const [selectedWorkflowTypeIdsStr, setSelectedWorkflowTypeIdsStr] = useState<string>('');

  const [selectedWorkflowRunId, setSelectedWorkflowRunId] = useState<string>('');

  // handle query params changes
  const onChangeParams = async () => {
    setSearchBoxContent(getQueryParams().search as string);

    setStartDate(getQueryParams().startDate as string);
    setEndDate(getQueryParams().endDate as string);

    // handle selectedWorkflowTypeIds changes
    if (!getQueryParams().workflowTypeId) {
      setSelectedWorkflowTypeIdsStr('-1');
    } else if (getQueryParams().workflowTypeId instanceof Array) {
      setSelectedWorkflowTypeIdsStr(getQueryParams().workflowTypeId.sort().join(','));
    } else {
      setSelectedWorkflowTypeIdsStr(getQueryParams().workflowTypeId);
    }

    // handle selectedworkflowRunStatus changes
    setSelectWorkflowStatus(
      getQueryParams().workflowRunStatus as 'succeeded' | 'failed' | 'aborted' | 'ongoing' | null
    );

    // handle selectedWorkflowRunId changes
    setSelectedWorkflowRunId(getQueryParams().workflowRunId as string);
  };
  const { setQueryParams, getPaginationParams, clearQueryParams, getQueryParams, queryParams } =
    useQueryParams(onChangeParams);

  // const getSelectedWorkflowTypeIds = () => {
  //   if (selectedWorkflowTypeIdsStr === '-1' || !selectedWorkflowTypeIdsStr) {
  //     return [];
  //   }
  //   return selectedWorkflowTypeIdsStr.split(',').map((id) => Number(id));
  // }

  // Api call to get workflow runs
  const { data: workflowRunsData } = useWorkflowRunListModel({
    params: {
      query: {
        page: getQueryParams().page || 1,
        rowsPerPage: getPaginationParams().rowsPerPage || 10,
        search: getQueryParams().search || undefined,
        workflow__id: getQueryParams().workflowTypeId,
        status: ['succeeded', 'failed', 'aborted'].includes(getQueryParams().workflowRunStatus)
          ? getQueryParams().workflowRunStatus
          : undefined,
        is_ongoing: getQueryParams().workflowRunStatus == 'ongoing' || undefined,
        start_time: getQueryParams().startDate || undefined,
        end_time: getQueryParams().endDate || undefined,
      },
    },
  });

  const { data: workflowData } = useWorkflowModel({
    params: {
      query: { page: 1, rowsPerPage: DEFAULT_NON_PAGINATE_PAGE_SIZE },
    },
  });

  if (!workflowRunsData) {
    throw new Error('No workflow Run Data');
  }

  if (!workflowData) {
    throw new Error('No workflow Data');
  }

  const workflowTypeOptions = useMemo(
    () => [
      { value: '-1', label: 'All workflow', secondaryLabel: '' },
      ...workflowData.results.map((workflowType: WorkflowModel) => ({
        value: workflowType.id.toString(),
        label: workflowType.workflowName,
        secondaryLabel: 'v' + workflowType.workflowVersion,
      })),
    ],
    [workflowData]
  );

  useEffect(() => {
    // handle selectedWorkflowTypeIds changes to set selectedWorkflowTypeIdsStr
    if (queryParams.getAll('workflowTypeId').length === 0) {
      setSelectedWorkflowTypeIdsStr('-1');
    } else {
      setSelectedWorkflowTypeIdsStr(queryParams.getAll('workflowTypeId').sort().join(','));
    }
    // setSelectedWorkflowTypeIdsStr(queryParams.getAll('workflowTypeId').sort().join(','));
    setSearchBoxContent(queryParams.get('search') as string);
    setSelectWorkflowStatus(
      queryParams.get('workflowRunStatus') as 'succeeded' | 'failed' | 'aborted' | 'ongoing' | null
    );
    setStartDate(queryParams.get('startDate'));
    setEndDate(queryParams.get('endDate'));
  }, [queryParams]);

  const closeDrawer = () => {
    setQueryParams({ workflowRunId: null });
  };

  const handleSelectWorkflowType = (selected: (string | number)[]) => {
    if (selected.length === 0 || selected.includes('-1')) {
      setQueryParams({ workflowTypeId: null });
    } else {
      setQueryParams({ workflowTypeId: selected });
    }
  };

  const handleOngoingOnlyToggle = (checked: boolean) => {
    if (!checked) {
      setQueryParams({ ongoingChecked: null });
    } else {
      setQueryParams({ ongoingChecked: true });
    }
  };

  // const handleCloseDrawer = useCallback(() => {
  //   setQueryParams({ workflowRunId: null });
  // }, [setQueryParams]);

  return (
    <div className='w-full'>
      <WorkflowRunTableHeader
        setQueryParams={setQueryParams}
        searchBoxContent={searchBoxContent}
        workflowTypeLists={workflowTypeOptions}
        clearQueryParams={clearQueryParams}
        queryWorkflowTypeIdsStr={selectedWorkflowTypeIdsStr}
        handleSelectWorkflowType={handleSelectWorkflowType}
        workflowStatus={selectWorkflowStatus}
        handleOngoingOnlyToggle={handleOngoingOnlyToggle}
        selectedStartDate={startDate}
        selectedEndDate={endDate}
      />
      <Suspense fallback={<div>loading data</div>}>
        <WorkflowRunTable
          tableData={workflowRunsData.results}
          setQueryParams={setQueryParams}
          pagination={{
            page: workflowRunsData.pagination?.page ?? 1,
            rowsPerPage: workflowRunsData.pagination?.rowsPerPage ?? 10,
            count: workflowRunsData.pagination?.count ?? 0,
          }}
        />
      </Suspense>

      {selectedWorkflowRunId && (
        <WorkflowRunDetailsDrawer
          selectedWorkflowRunId={selectedWorkflowRunId}
          onCloseDrawer={closeDrawer}
        />
      )}
    </div>
  );
};

export default WorkflowRunsTable;
