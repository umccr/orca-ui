import { useWorkflowRunListModel, useWorkflowModel } from '@/api/workflow';
import { Suspense, useEffect, useState } from 'react';

import { useQueryParams } from '@/hooks/useQueryParams';
import { DEFAULT_NON_PAGINATE_PAGE_SIZE } from '@/utils/constant';

// import { SelectItems } from '@/components/common/select';
import { WorkflowRunDetailsDrawer } from './WorkflowRunDetailsDrawer';

import WorkflowRunTableHeader from './WorkflowRunTableHeader';
import WorkflowRunTable from '../tables/WorkflowRunTable';

import type { WorkflowModel } from '@/api/workflow';

const WorkflowRunsTable = () => {
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchBoxContent, setSearchBoxContent] = useState<string>('');
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [selectWorkflowStatus, setSelectWorkflowStatus] = useState<
    'succeeded' | 'failed' | 'aborted' | 'ongoing' | null
  >(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // bugfix: if set array object to state, it will be refresh the page continuously as the object is always new
  // Convert selectedWorkflowTypeIds to selectedWorkflowTypeIdsStr: selectedWorkflowTypeIds.sort().join(',')
  const [selectedWorkflowTypeIdsStr, setSelectedWorkflowTypeIdsStr] = useState<string>('');

  // handle query params changes
  const onChangeParams = async () => {
    setPage(getPaginationParams().page);
    setRowsPerPage(getPaginationParams().rowsPerPage);
    setOpenDrawer(getQueryParams().openDrawer === 'true');
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
  };
  const { setQueryParams, getPaginationParams, clearQueryParams, getQueryParams, queryParams } =
    useQueryParams(onChangeParams);

  useEffect(() => {
    setPage(Number(queryParams.get('page')));
    setRowsPerPage(Number(queryParams.get('rowsPerPage')));
    setOpenDrawer(queryParams.get('openDrawer') === 'true');

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

  // const getSelectedWorkflowTypeIds = () => {
  //   if (selectedWorkflowTypeIdsStr === '-1' || !selectedWorkflowTypeIdsStr) {
  //     return [];
  //   }
  //   return selectedWorkflowTypeIdsStr.split(',').map((id) => Number(id));
  // }

  // Api call to get workflow runs
  const WorkflowRunsModel = useWorkflowRunListModel({
    params: {
      query: {
        page: page || 1,
        rowsPerPage: rowsPerPage || undefined,
        search: searchBoxContent || undefined,
        workflow__id:
          selectedWorkflowTypeIdsStr === '-1' || !selectedWorkflowTypeIdsStr
            ? undefined
            : selectedWorkflowTypeIdsStr.split(','),
        status:
          selectWorkflowStatus == 'succeeded' ||
          selectWorkflowStatus == 'failed' ||
          selectWorkflowStatus == 'aborted'
            ? selectWorkflowStatus
            : undefined,
        is_ongoing: selectWorkflowStatus == 'ongoing' || undefined,
        start_time: startDate || undefined,
        end_time: endDate || undefined,
      },
    },
  });

  const WorkflowsModel = useWorkflowModel({
    params: {
      query: { page: 1, rowsPerPage: DEFAULT_NON_PAGINATE_PAGE_SIZE },
    },
  });

  const workflowRunsData = WorkflowRunsModel.data;
  if (!workflowRunsData) {
    throw new Error('No workflow Run Data');
  }

  const workflowData = WorkflowsModel.data;
  if (!workflowData) {
    throw new Error('No workflow Data');
  }

  const tableData = workflowRunsData.results;
  const workflowTypeOptions = [
    { value: '-1', label: 'All workflow', secondaryLabel: '' },
    ...workflowData.results.map((workflowType: WorkflowModel) => ({
      value: workflowType.id.toString(),
      label: workflowType.workflowName,
      secondaryLabel: 'v' + workflowType.workflowVersion,
    })),
  ];

  const closeDrawer = () => {
    setQueryParams({ openDrawer: null, workflowRunId: null });
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
          tableData={tableData}
          setQueryParams={setQueryParams}
          pagination={{
            page: workflowRunsData.pagination?.page ?? 1,
            rowsPerPage: workflowRunsData.pagination?.rowsPerPage ?? 10,
            count: workflowRunsData.pagination?.count ?? 0,
          }}
        />
      </Suspense>

      <WorkflowRunDetailsDrawer isOpen={openDrawer} setIsOpen={closeDrawer} />
    </div>
  );
};

export default WorkflowRunsTable;
