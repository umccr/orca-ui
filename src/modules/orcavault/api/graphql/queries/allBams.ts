import { FieldDefinition } from '@/modules/orcavault/components/GraphqlFilter';
import { graphql } from '../codegen/gql';

export const BAMS_FIELD_LABEL: FieldDefinition[] = [
  { key: 'filename', label: 'Filename', type: 'string', sortKeyPrefix: 'FILENAME' },
  {
    key: 'lastModifiedDate',
    label: 'Last Modified Date',
    type: 'timestamp',
    sortKeyPrefix: 'LAST_MODIFIED_DATE',
  },
  { key: 'portalRunId', label: 'Portal Run ID', type: 'string', sortKeyPrefix: 'PORTAL_RUN_ID' },
  { key: 'libraryId', label: 'Library ID', type: 'string', sortKeyPrefix: 'LIBRARY_ID' },

  { key: 'cohortId', label: 'Cohort ID', type: 'string', sortKeyPrefix: 'COHORT_ID' },
  { key: 'bucket', label: 'Bucket', type: 'string', sortKeyPrefix: 'BUCKET' },
  { key: 'key', label: 'Key', type: 'string', sortKeyPrefix: 'KEY' },
  { key: 'format', label: 'Format', type: 'string', sortKeyPrefix: 'FORMAT' },
  { key: 'eTag', label: 'ETag', type: 'string', sortKeyPrefix: 'ETAG' },
  { key: 'size', label: 'Size', type: 'int', sortKeyPrefix: 'SIZE' },
  { key: 'storageClass', label: 'Storage Class', type: 'string', sortKeyPrefix: 'STORAGE_CLASS' },
];

export const ALL_BAMS_QUERY = graphql(`
  query all_bams(
    $first: Int! = 10
    $offset: Int = 0
    $orderBy: [BamsOrderBy!] = [LAST_MODIFIED_DATE_DESC]
    $filter: BamFilter
  ) {
    allBams(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {
      nodes {
        bucket
        cohortId
        eTag
        filename
        format
        key
        lastModifiedDate
        libraryId
        portalRunId
        size
        storageClass
      }
      totalCount
    }
  }
`);
