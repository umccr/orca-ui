/* eslint-disable react-refresh/only-export-components */
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347

import { createContext, FC, PropsWithChildren, ReactElement, useContext, useState } from 'react';
import { useWorkflowRunDetailModel } from '@/api/workflow';
// import type { WorkflowRunModel } from '@/api/workflow';
import { useParams } from 'react-router-dom';

const WorkflowRunContext = createContext({
  refreshWorkflowRuns: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setRefreshWorkflowRuns: (_value: boolean) => {},
  workflowRunDetail: {} as ReturnType<typeof useWorkflowRunDetailModel>['data'],
  isFetchingWorkflowRunDetail: true,
});

export const WorkflowRunProvider: FC<PropsWithChildren> = ({ children }): ReactElement => {
  const [refreshWorkflowRuns, setRefreshWorkflowRuns] = useState<boolean>(false);
  const { orcabusId } = useParams();

  const { data: workflowRunDetail, isFetching: isFetchingWorkflowRunDetail } =
    useWorkflowRunDetailModel({
      params: { path: { orcabusId: (orcabusId as string).split('.')[1] } },
      reactQuery: {
        enabled: !!orcabusId,
      },
    });

  return (
    <WorkflowRunContext.Provider
      value={{
        refreshWorkflowRuns,
        setRefreshWorkflowRuns,
        workflowRunDetail,
        isFetchingWorkflowRunDetail,
      }}
    >
      {children}
    </WorkflowRunContext.Provider>
  );
};

export const useWorkflowRunContext = () => {
  return useContext(WorkflowRunContext);
};
