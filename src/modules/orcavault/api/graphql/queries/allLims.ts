import { FieldDefinition } from '@/modules/orcavault/components/GraphqlFilter';
import { graphql } from '../codegen/gql';
import { LimFilter } from '../codegen/graphql';
import { Filter } from '@/modules/orcavault/components/utils';

export const FIELD_LABEL: FieldDefinition[] = [
  { key: 'assay', label: 'Assay', type: 'string' },
  { key: 'externalSampleId', label: 'External Sample ID', type: 'string' },
  { key: 'externalSubjectId', label: 'External Subject ID', type: 'string' },
  { key: 'experimentId', label: 'Experiment ID', type: 'string' },
  { key: 'internalSubjectId', label: 'Internal Subject ID', type: 'string' },
  { key: 'libraryId', label: 'Library ID', type: 'string' },
  { key: 'loadDatetime', label: 'Load DateTime', type: 'timestamp' },
  { key: 'ownerId', label: 'Owner ID', type: 'string' },
  { key: 'phenotype', label: 'Phenotype', type: 'string' },
  { key: 'projectId', label: 'Project ID', type: 'string' },
  { key: 'quality', label: 'Quality', type: 'string' },
  { key: 'sampleId', label: 'Sample ID', type: 'string' },
  { key: 'sequencingRunDate', label: 'Sequencing Run Date', type: 'date' },
  { key: 'sequencingRunId', label: 'Sequencing Run ID', type: 'string' },
  { key: 'source', label: 'Source', type: 'string' },
  { key: 'truseqIndex', label: 'Truseq Index', type: 'string' },
  { key: 'type', label: 'Type', type: 'string' },
  { key: 'workflow', label: 'Workflow', type: 'string' },
  { key: 'aliasLibraryId', label: 'Alias Library ID', type: 'string' },
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

export function buildGraphQLFilter(filters: Filter[]): LimFilter {
  return {
    and: filters.map((f) => ({
      [f.key]: {
        [f.operator]: f.value,
      },
    })),
  };
}
