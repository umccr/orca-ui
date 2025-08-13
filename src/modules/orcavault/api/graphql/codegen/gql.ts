/* eslint-disable */
import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  '\n  query all_bams(\n    $first: Int! = 10\n    $offset: Int = 0\n    $orderBy: [BamsOrderBy!] = [LAST_MODIFIED_DATE_DESC]\n    $filter: BamFilter\n  ) {\n    allBams(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {\n      nodes {\n        bucket\n        cohortId\n        eTag\n        filename\n        format\n        key\n        lastModifiedDate\n        libraryId\n        portalRunId\n        size\n        storageClass\n      }\n      totalCount\n    }\n  }\n': typeof types.All_BamsDocument;
  '\n  query all_fastqs(\n    $first: Int! = 10\n    $offset: Int = 0\n    $orderBy: [FastqsOrderBy!] = [LAST_MODIFIED_DATE_DESC]\n    $filter: FastqFilter\n  ) {\n    allFastqs(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {\n      nodes {\n        sequencingRunId\n        sequencingRunDate\n        portalRunId\n        cohortId\n        bucket\n        key\n        libraryId\n        filename\n        format\n        size\n        storageClass\n        eTag\n        lastModifiedDate\n      }\n      totalCount\n    }\n  }\n': typeof types.All_FastqsDocument;
  '\n  query all_lims(\n    $first: Int! = 10\n    $offset: Int = 0\n    $orderBy: [LimsOrderBy!] = [SEQUENCING_RUN_DATE_DESC]\n    $filter: LimFilter\n  ) {\n    allLims(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {\n      totalCount\n      nodes {\n        libraryId\n        workflow\n        type\n        truseqIndex\n        source\n        sequencingRunId\n        sequencingRunDate\n        sampleId\n        quality\n        projectId\n        phenotype\n        ownerId\n        loadDatetime\n        internalSubjectId\n        externalSubjectId\n        externalSampleId\n        experimentId\n        assay\n        aliasLibraryId\n      }\n    }\n  }\n': typeof types.All_LimsDocument;
  '\n  query all_workflows(\n    $first: Int! = 10\n    $offset: Int = 0\n    $orderBy: [WorkflowsOrderBy!] = [WORKFLOW_END_DESC]\n    $filter: WorkflowFilter\n  ) {\n    allWorkflows(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {\n      nodes {\n        libraryId\n        portalRunId\n        workflowComment\n        workflowDuration\n        workflowEnd\n        workflowName\n        workflowStatus\n        workflowVersion\n        workflowStart\n      }\n      totalCount\n    }\n  }\n': typeof types.All_WorkflowsDocument;
};
const documents: Documents = {
  '\n  query all_bams(\n    $first: Int! = 10\n    $offset: Int = 0\n    $orderBy: [BamsOrderBy!] = [LAST_MODIFIED_DATE_DESC]\n    $filter: BamFilter\n  ) {\n    allBams(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {\n      nodes {\n        bucket\n        cohortId\n        eTag\n        filename\n        format\n        key\n        lastModifiedDate\n        libraryId\n        portalRunId\n        size\n        storageClass\n      }\n      totalCount\n    }\n  }\n':
    types.All_BamsDocument,
  '\n  query all_fastqs(\n    $first: Int! = 10\n    $offset: Int = 0\n    $orderBy: [FastqsOrderBy!] = [LAST_MODIFIED_DATE_DESC]\n    $filter: FastqFilter\n  ) {\n    allFastqs(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {\n      nodes {\n        sequencingRunId\n        sequencingRunDate\n        portalRunId\n        cohortId\n        bucket\n        key\n        libraryId\n        filename\n        format\n        size\n        storageClass\n        eTag\n        lastModifiedDate\n      }\n      totalCount\n    }\n  }\n':
    types.All_FastqsDocument,
  '\n  query all_lims(\n    $first: Int! = 10\n    $offset: Int = 0\n    $orderBy: [LimsOrderBy!] = [SEQUENCING_RUN_DATE_DESC]\n    $filter: LimFilter\n  ) {\n    allLims(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {\n      totalCount\n      nodes {\n        libraryId\n        workflow\n        type\n        truseqIndex\n        source\n        sequencingRunId\n        sequencingRunDate\n        sampleId\n        quality\n        projectId\n        phenotype\n        ownerId\n        loadDatetime\n        internalSubjectId\n        externalSubjectId\n        externalSampleId\n        experimentId\n        assay\n        aliasLibraryId\n      }\n    }\n  }\n':
    types.All_LimsDocument,
  '\n  query all_workflows(\n    $first: Int! = 10\n    $offset: Int = 0\n    $orderBy: [WorkflowsOrderBy!] = [WORKFLOW_END_DESC]\n    $filter: WorkflowFilter\n  ) {\n    allWorkflows(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {\n      nodes {\n        libraryId\n        portalRunId\n        workflowComment\n        workflowDuration\n        workflowEnd\n        workflowName\n        workflowStatus\n        workflowVersion\n        workflowStart\n      }\n      totalCount\n    }\n  }\n':
    types.All_WorkflowsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query all_bams(\n    $first: Int! = 10\n    $offset: Int = 0\n    $orderBy: [BamsOrderBy!] = [LAST_MODIFIED_DATE_DESC]\n    $filter: BamFilter\n  ) {\n    allBams(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {\n      nodes {\n        bucket\n        cohortId\n        eTag\n        filename\n        format\n        key\n        lastModifiedDate\n        libraryId\n        portalRunId\n        size\n        storageClass\n      }\n      totalCount\n    }\n  }\n'
): typeof import('./graphql').All_BamsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query all_fastqs(\n    $first: Int! = 10\n    $offset: Int = 0\n    $orderBy: [FastqsOrderBy!] = [LAST_MODIFIED_DATE_DESC]\n    $filter: FastqFilter\n  ) {\n    allFastqs(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {\n      nodes {\n        sequencingRunId\n        sequencingRunDate\n        portalRunId\n        cohortId\n        bucket\n        key\n        libraryId\n        filename\n        format\n        size\n        storageClass\n        eTag\n        lastModifiedDate\n      }\n      totalCount\n    }\n  }\n'
): typeof import('./graphql').All_FastqsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query all_lims(\n    $first: Int! = 10\n    $offset: Int = 0\n    $orderBy: [LimsOrderBy!] = [SEQUENCING_RUN_DATE_DESC]\n    $filter: LimFilter\n  ) {\n    allLims(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {\n      totalCount\n      nodes {\n        libraryId\n        workflow\n        type\n        truseqIndex\n        source\n        sequencingRunId\n        sequencingRunDate\n        sampleId\n        quality\n        projectId\n        phenotype\n        ownerId\n        loadDatetime\n        internalSubjectId\n        externalSubjectId\n        externalSampleId\n        experimentId\n        assay\n        aliasLibraryId\n      }\n    }\n  }\n'
): typeof import('./graphql').All_LimsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query all_workflows(\n    $first: Int! = 10\n    $offset: Int = 0\n    $orderBy: [WorkflowsOrderBy!] = [WORKFLOW_END_DESC]\n    $filter: WorkflowFilter\n  ) {\n    allWorkflows(first: $first, offset: $offset, orderBy: $orderBy, filter: $filter) {\n      nodes {\n        libraryId\n        portalRunId\n        workflowComment\n        workflowDuration\n        workflowEnd\n        workflowName\n        workflowStatus\n        workflowVersion\n        workflowStart\n      }\n      totalCount\n    }\n  }\n'
): typeof import('./graphql').All_WorkflowsDocument;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
