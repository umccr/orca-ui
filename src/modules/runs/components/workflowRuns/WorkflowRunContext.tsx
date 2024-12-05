import { createContext, FC, PropsWithChildren, ReactElement, useContext, useState } from 'react';

const WorkflowRunContext = createContext({
  refreshWorkflowRuns: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setRefreshWorkflowRuns: (value: boolean) => {},
});

export const WorkflowRunProvider: FC<PropsWithChildren> = ({ children }): ReactElement => {
  const [refreshWorkflowRuns, setRefreshWorkflowRuns] = useState<boolean>(false);

  return (
    <WorkflowRunContext.Provider value={{ refreshWorkflowRuns, setRefreshWorkflowRuns }}>
      {children}
    </WorkflowRunContext.Provider>
  );
};

export const useWorkflowRunContext = () => {
  return useContext(WorkflowRunContext);
};
