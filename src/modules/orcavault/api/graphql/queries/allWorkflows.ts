import { FieldDefinition } from '@/modules/orcavault/components/GraphqlFilter';
import { graphql } from '../codegen/gql';

export const WORKFLOWS_FIELD_LABEL: FieldDefinition[] = [
  { key: 'libraryId', label: 'Library ID', type: 'string', sortKeyPrefix: 'LIBRARY_ID' },
  { key: 'portalRunId', label: 'Portal Run ID', type: 'string', sortKeyPrefix: 'PORTAL_RUN_ID' },
  { key: 'workflowName', label: 'Workflow Name', type: 'string', sortKeyPrefix: 'WORKFLOW_NAME' },
  {
    key: 'workflowVersion',
    label: 'Workflow Version',
    type: 'string',
    sortKeyPrefix: 'WORKFLOW_VERSION',
  },
  {
    key: 'workflowStatus',
    label: 'Workflow Status',
    type: 'string',
    sortKeyPrefix: 'WORKFLOW_STATUS',
  },

  {
    key: 'workflowComment',
    label: 'Workflow Comment',
    type: 'string',
    sortKeyPrefix: 'WORKFLOW_COMMENT',
  },

  {
    key: 'workflowStart',
    label: 'Workflow Start',
    type: 'timestamp',
    sortKeyPrefix: 'WORKFLOW_START',
  },
  { key: 'workflowEnd', label: 'Workflow End', type: 'timestamp', sortKeyPrefix: 'WORKFLOW_END' },
  {
    key: 'workflowDuration',
    label: 'Workflow Duration',
    type: 'float',
    sortKeyPrefix: 'WORKFLOW_DURATION',
  },
];

export const ALL_WORKFLOWS_QUERY = graphql(`
  query all_workflows(
    $first: Int! = 10
    $offset: Int = 0
    $orderBy: [WorkflowsOrderBy!] = [WORKFLOW_END_DESC]
    $filter: WorkflowFilter
  ) {
    allWorkflows(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      nodes {
        libraryId
        portalRunId
        workflowComment
        workflowDuration
        workflowEnd
        workflowName
        workflowStatus
        workflowVersion
        workflowStart
      }
      totalCount
    }
  }
`);
