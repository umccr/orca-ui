/* eslint-disable react-refresh/only-export-components */
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347

import { createContext, FC, PropsWithChildren, ReactElement, useContext, useState } from 'react';
import {
  useWorkflowRunCommentModel,
  useWorkflowRunDetailModel,
  useWorkflowStateModel,
} from '@/api/workflow';
// import type { WorkflowRunModel } from '@/api/workflow';
import { useParams } from 'react-router-dom';
import { SpinnerWithText } from '@/components/common/spinner';
const WorkflowRunContext = createContext({
  refreshWorkflowRuns: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setRefreshWorkflowRuns: (_value: boolean) => {},
  workflowRunDetail: {} as ReturnType<typeof useWorkflowRunDetailModel>['data'],
  isFetchingWorkflowRunDetail: true,
  // comment
  workflowCommentData: {} as ReturnType<typeof useWorkflowRunCommentModel>['data'],
  isFetchingWorkflowComment: true,
  refetchWorkflowComment: () => {},
  // state
  workflowStateData: {} as ReturnType<typeof useWorkflowStateModel>['data'],
  isFetchingWorkflowState: true,
  refetchWorkflowState: () => {},
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
  const {
    data: workflowCommentData,
    isFetching: isFetchingWorkflowComment,
    refetch: refetchWorkflowComment,
  } = useWorkflowRunCommentModel({
    params: { path: { orcabusId: orcabusId as string } },
    reactQuery: {
      enabled: !!orcabusId,
    },
  });
  const {
    data: workflowStateData,
    isFetching: isFetchingWorkflowState,
    refetch: refetchWorkflowState,
  } = useWorkflowStateModel({
    params: { path: { orcabusId: orcabusId as string } },
    reactQuery: {
      enabled: !!orcabusId,
    },
  });

  const isFetching =
    isFetchingWorkflowRunDetail || isFetchingWorkflowComment || isFetchingWorkflowState;

  return (
    <>
      {isFetching ? (
        <div className='h-screen'>
          <SpinnerWithText text='Loading...' />
        </div>
      ) : (
        <WorkflowRunContext.Provider
          value={{
            refreshWorkflowRuns,
            setRefreshWorkflowRuns,
            workflowRunDetail,
            isFetchingWorkflowRunDetail,
            workflowCommentData,
            isFetchingWorkflowComment,
            refetchWorkflowComment,
            workflowStateData,
            isFetchingWorkflowState,
            refetchWorkflowState,
          }}
        >
          {children}
        </WorkflowRunContext.Provider>
      )}
    </>
  );
};

export const useWorkflowRunContext = () => {
  return useContext(WorkflowRunContext);
};
