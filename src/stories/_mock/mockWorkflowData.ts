// mock data for workflow data
//{}
interface MockWorkflowData {
  [workflowType: string]: Array<{
    SubjectID: string;
    // ... other properties as needed
  }>;
}
export const mockWorkflowData: MockWorkflowData = {
  'workflow-type-1': [
    {
      SubjectID: '123',
    },
    {
      SubjectID: '456',
    },
  ],
  'workflow-type-2': [
    {
      SubjectID: '456',
    },
    {
      SubjectID: '789',
    },
  ],
  'type-3': [
    {
      SubjectID: '101',
    },
  ],
};
