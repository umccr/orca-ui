import { useWorkflowRunListModel, useWorkflowModel } from '@/api/workflow';
import { Suspense, useEffect, useState } from 'react';

import { useQueryParams } from '@/hooks/useQueryParams';
import { WORKFLOW_RUN_DEFAULT_PAGE_SIZE, DEFAULT_NON_PAGINATE_PAGE_SIZE } from '@/utils/constant';

import { SelectItems } from '@/components/common/select';
import { WorkflowRunDetailsDrawer } from './WorkflowRunDetailsDrawer';

import WorkflowRunTableHeader from './WorkflowRunTableHeader';
import WorkflowRunTable from '../tables/WorkflowRunTable';

import type { WorkflowModel } from '@/api/workflow';

const WorkflowRunsTable = () => {
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(WORKFLOW_RUN_DEFAULT_PAGE_SIZE);
  const [searchBoxContent, setSearchBoxContent] = useState<string>('');
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [selectedWorkflowTypeId, setSelectedWorkflowTypeId] = useState<string | null>(null);
  const [isOngoingOnly, setIsOngoingOnly] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // handle query params changes
  const onChangeParams = async () => {
    setPage(getPaginationParams().page);
    setRowsPerPage(getPaginationParams().rowsPerPage);
    setOpenDrawer(getQueryParams().openDrawer === 'true');
    setOpenDrawer(getQueryParams().openDrawer === 'true');
    setSearchBoxContent(getQueryParams().search as string);
    setIsOngoingOnly(getQueryParams().ongoingChecked === 'true');
    setStartDate(getQueryParams().startDate as string);
    setEndDate(getQueryParams().endDate as string);
  };
  const { setQueryParams, getPaginationParams, clearQueryParams, getQueryParams, queryParams } =
    useQueryParams(onChangeParams, WORKFLOW_RUN_DEFAULT_PAGE_SIZE);

  useEffect(() => {
    setPage(Number(queryParams.get('page')));
    setRowsPerPage(Number(queryParams.get('rowsPerPage')));
    setOpenDrawer(queryParams.get('openDrawer') === 'true');
    setSelectedWorkflowTypeId(queryParams.get('workflowTypeId'));
    setSearchBoxContent(queryParams.get('search') as string);
    setIsOngoingOnly(queryParams.get('ongoingChecked') === 'true');
    setStartDate(queryParams.get('startDate'));
    setEndDate(queryParams.get('endDate'));
  }, [queryParams]);

  // Api call to get workflow runs
  const WorkflowRunsModel = useWorkflowRunListModel({
    params: {
      query: {
        page: page || 1,
        rowsPerPage: rowsPerPage || WORKFLOW_RUN_DEFAULT_PAGE_SIZE,
        search: searchBoxContent || undefined,
        workflow__id: selectedWorkflowTypeId || undefined,
        is_ongoing: isOngoingOnly || undefined,
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

  const handleSelectWorkflowType = (selected: SelectItems) => {
    if (selected.value === '-1') {
      setQueryParams({ workflowTypeId: null });
    } else {
      setQueryParams({ workflowTypeId: selected.value });
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
    <div>
      <WorkflowRunTableHeader
        setQueryParams={setQueryParams}
        searchBoxContent={searchBoxContent}
        workflowTypeLists={workflowTypeOptions}
        clearQueryParams={clearQueryParams}
        queryWorkflowTypeId={selectedWorkflowTypeId}
        handleSelectWorkflowType={handleSelectWorkflowType}
        isOngoingOnly={isOngoingOnly}
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
            rowsPerPage: workflowRunsData.pagination?.rowsPerPage ?? WORKFLOW_RUN_DEFAULT_PAGE_SIZE,
            count: workflowRunsData.pagination?.count ?? 0,
          }}
        />
      </Suspense>

      <WorkflowRunDetailsDrawer isOpen={openDrawer} setIsOpen={closeDrawer} />
    </div>
  );
};

export default WorkflowRunsTable;
