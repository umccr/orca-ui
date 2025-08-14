import { FieldDefinition } from '@/modules/orcavault/components/GraphqlFilter';
import { graphql } from '../codegen/gql';

export const FASTQS_FIELD_LABEL: FieldDefinition[] = [
  { key: 'filename', label: 'Filename', type: 'string', sortKeyPrefix: 'FILENAME' },
  { key: 'libraryId', label: 'Library ID', type: 'string', sortKeyPrefix: 'LIBRARY_ID' },
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
  { key: 'portalRunId', label: 'Portal Run ID', type: 'string', sortKeyPrefix: 'PORTAL_RUN_ID' },
  { key: 'cohortId', label: 'Cohort ID', type: 'string', sortKeyPrefix: 'COHORT_ID' },
  { key: 'bucket', label: 'Bucket', type: 'string', sortKeyPrefix: 'BUCKET' },
  { key: 'key', label: 'Key', type: 'string', sortKeyPrefix: 'KEY' },
  { key: 'format', label: 'Format', type: 'string', sortKeyPrefix: 'FORMAT' },
  { key: 'size', label: 'Size', type: 'int', sortKeyPrefix: 'SIZE' },
  { key: 'storageClass', label: 'Storage Class', type: 'string', sortKeyPrefix: 'STORAGE_CLASS' },
  { key: 'eTag', label: 'ETag', type: 'string', sortKeyPrefix: 'ETAG' },
  {
    key: 'lastModifiedDate',
    label: 'Last Modified Date',
    type: 'timestamp',
    sortKeyPrefix: 'LAST_MODIFIED_DATE',
  },
];

export const ALL_FASTQS_QUERY = graphql(`
  query all_fastqs(
    $first: Int! = 10
    $offset: Int = 0
    $orderBy: [FastqsOrderBy!] = [LAST_MODIFIED_DATE_DESC]
    $filter: FastqFilter
  ) {
    allFastqs(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      nodes {
        sequencingRunId
        sequencingRunDate
        portalRunId
        cohortId
        bucket
        key
        libraryId
        filename
        format
        size
        storageClass
        eTag
        lastModifiedDate
      }
      totalCount
    }
  }
`);
