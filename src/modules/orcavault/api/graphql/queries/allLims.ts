import { FieldDefinition } from '@/modules/orcavault/components/GraphqlFilter';
import { graphql } from '../codegen/gql';

export const LIMS_FIELD_LABEL: FieldDefinition[] = [
  {
    key: 'aliasLibraryId',
    label: 'Alias Library ID',
    type: 'string',
    sortKeyPrefix: 'ALIAS_LIBRARY_ID',
  },
  { key: 'assay', label: 'Assay', type: 'string', sortKeyPrefix: 'ASSAY' },
  { key: 'experimentId', label: 'Experiment ID', type: 'string', sortKeyPrefix: 'EXPERIMENT_ID' },
  {
    key: 'externalSampleId',
    label: 'External Sample ID',
    type: 'string',
    sortKeyPrefix: 'EXTERNAL_SAMPLE_ID',
  },
  {
    key: 'externalSubjectId',
    label: 'External Subject ID',
    type: 'string',
    sortKeyPrefix: 'EXTERNAL_SUBJECT_ID',
  },
  {
    key: 'internalSubjectId',
    label: 'Internal Subject ID',
    type: 'string',
    sortKeyPrefix: 'INTERNAL_SUBJECT_ID',
  },
  { key: 'libraryId', label: 'Library ID', type: 'string', sortKeyPrefix: 'LIBRARY_ID' },
  {
    key: 'loadDatetime',
    label: 'Load DateTime',
    type: 'timestamp',
    sortKeyPrefix: 'LOAD_DATETIME',
  },
  { key: 'ownerId', label: 'Owner ID', type: 'string', sortKeyPrefix: 'OWNER_ID' },
  { key: 'phenotype', label: 'Phenotype', type: 'string', sortKeyPrefix: 'PHENOTYPE' },
  { key: 'projectId', label: 'Project ID', type: 'string', sortKeyPrefix: 'PROJECT_ID' },
  { key: 'quality', label: 'Quality', type: 'string', sortKeyPrefix: 'QUALITY' },
  { key: 'sampleId', label: 'Sample ID', type: 'string', sortKeyPrefix: 'SAMPLE_ID' },
  {
    key: 'sequencingRunDate',
    label: 'Sequencing Run Date',
    type: 'date',
    sortKeyPrefix: 'SEQUENCING_RUN_DATE',
  },
  {
    key: 'sequencingRunId',
    label: 'Sequencing Run ID',
    type: 'string',
    sortKeyPrefix: 'SEQUENCING_RUN_ID',
  },
  { key: 'source', label: 'Source', type: 'string', sortKeyPrefix: 'SOURCE' },
  { key: 'truseqIndex', label: 'Truseq Index', type: 'string', sortKeyPrefix: 'TRUSEQ_INDEX' },
  { key: 'type', label: 'Type', type: 'string', sortKeyPrefix: 'TYPE' },
  { key: 'workflow', label: 'Workflow', type: 'string', sortKeyPrefix: 'WORKFLOW' },
];

export const ALL_LIMS_QUERY = graphql(`
  query all_lims(
    $first: Int! = 10
    $offset: Int = 0
    $orderBy: [LimsOrderBy!] = [SEQUENCING_RUN_DATE_DESC]
    $filter: LimFilter
  ) {
    allLims(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      totalCount
      nodes {
        libraryId
        workflow
        type
        truseqIndex
        source
        sequencingRunId
        sequencingRunDate
        sampleId
        quality
        projectId
        phenotype
        ownerId
        loadDatetime
        internalSubjectId
        externalSubjectId
        externalSampleId
        experimentId
        assay
        aliasLibraryId
      }
    }
  }
`);
