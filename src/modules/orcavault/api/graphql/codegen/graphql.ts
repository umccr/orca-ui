/* eslint-disable */
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A floating point number that requires more precision than IEEE 754 binary 64 */
  BigFloat: { input: any; output: any };
  /**
   * A signed eight-byte integer. The upper big integer values are greater than the
   * max value for a JavaScript number. Therefore all big integers will be output as
   * strings and not numbers.
   */
  BigInt: { input: any; output: any };
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: { input: any; output: any };
  /** A calendar date in YYYY-MM-DD format. */
  Date: { input: any; output: any };
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
   * 3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
   * that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
   * to unexpected results.
   */
  Datetime: { input: any; output: any };
  /** Represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any };
  /** A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
  UUID: { input: any; output: any };
};

export type Bam = {
  __typename?: 'Bam';
  bucket?: Maybe<Scalars['String']['output']>;
  cohortId?: Maybe<Scalars['String']['output']>;
  eTag?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Datetime']['output']>;
  libraryId?: Maybe<Scalars['String']['output']>;
  portalRunId?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['BigInt']['output']>;
  storageClass?: Maybe<Scalars['String']['output']>;
};

/** A condition to be used against `Bam` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type BamCondition = {
  /** Checks for equality with the object’s `bucket` field. */
  bucket?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `cohortId` field. */
  cohortId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `eTag` field. */
  eTag?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `filename` field. */
  filename?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `format` field. */
  format?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `key` field. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `lastModifiedDate` field. */
  lastModifiedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `libraryId` field. */
  libraryId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `portalRunId` field. */
  portalRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `size` field. */
  size?: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `storageClass` field. */
  storageClass?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `Bam` object types. All fields are combined with a logical ‘and.’ */
export type BamFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<BamFilter>>;
  /** Filter by the object’s `bucket` field. */
  bucket?: InputMaybe<StringFilter>;
  /** Filter by the object’s `cohortId` field. */
  cohortId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `eTag` field. */
  eTag?: InputMaybe<StringFilter>;
  /** Filter by the object’s `filename` field. */
  filename?: InputMaybe<StringFilter>;
  /** Filter by the object’s `format` field. */
  format?: InputMaybe<StringFilter>;
  /** Filter by the object’s `key` field. */
  key?: InputMaybe<StringFilter>;
  /** Filter by the object’s `lastModifiedDate` field. */
  lastModifiedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `libraryId` field. */
  libraryId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<BamFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<BamFilter>>;
  /** Filter by the object’s `portalRunId` field. */
  portalRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `size` field. */
  size?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `storageClass` field. */
  storageClass?: InputMaybe<StringFilter>;
};

/** A connection to a list of `Bam` values. */
export type BamsConnection = {
  __typename?: 'BamsConnection';
  /** A list of edges which contains the `Bam` and cursor to aid in pagination. */
  edges: Array<BamsEdge>;
  /** A list of `Bam` objects. */
  nodes: Array<Bam>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Bam` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Bam` edge in the connection. */
export type BamsEdge = {
  __typename?: 'BamsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Bam` at the end of the edge. */
  node: Bam;
};

/** Methods to use when ordering `Bam`. */
export enum BamsOrderBy {
  BucketAsc = 'BUCKET_ASC',
  BucketDesc = 'BUCKET_DESC',
  CohortIdAsc = 'COHORT_ID_ASC',
  CohortIdDesc = 'COHORT_ID_DESC',
  ETagAsc = 'E_TAG_ASC',
  ETagDesc = 'E_TAG_DESC',
  FilenameAsc = 'FILENAME_ASC',
  FilenameDesc = 'FILENAME_DESC',
  FormatAsc = 'FORMAT_ASC',
  FormatDesc = 'FORMAT_DESC',
  KeyAsc = 'KEY_ASC',
  KeyDesc = 'KEY_DESC',
  LastModifiedDateAsc = 'LAST_MODIFIED_DATE_ASC',
  LastModifiedDateDesc = 'LAST_MODIFIED_DATE_DESC',
  LibraryIdAsc = 'LIBRARY_ID_ASC',
  LibraryIdDesc = 'LIBRARY_ID_DESC',
  Natural = 'NATURAL',
  PortalRunIdAsc = 'PORTAL_RUN_ID_ASC',
  PortalRunIdDesc = 'PORTAL_RUN_ID_DESC',
  SizeAsc = 'SIZE_ASC',
  SizeDesc = 'SIZE_DESC',
  StorageClassAsc = 'STORAGE_CLASS_ASC',
  StorageClassDesc = 'STORAGE_CLASS_DESC',
}

/** A filter to be used against BigFloat fields. All fields are combined with a logical ‘and.’ */
export type BigFloatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigFloat']['input']>>;
};

/** A filter to be used against BigInt fields. All fields are combined with a logical ‘and.’ */
export type BigIntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigInt']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigInt']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigInt']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigInt']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigInt']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigInt']['input']>>;
};

export type CurationLim = {
  __typename?: 'CurationLim';
  assay?: Maybe<Scalars['String']['output']>;
  experimentId?: Maybe<Scalars['String']['output']>;
  externalSampleId?: Maybe<Scalars['String']['output']>;
  externalSubjectId?: Maybe<Scalars['String']['output']>;
  internalSubjectId?: Maybe<Scalars['String']['output']>;
  libraryId?: Maybe<Scalars['String']['output']>;
  loadDatetime?: Maybe<Scalars['Datetime']['output']>;
  ownerId?: Maybe<Scalars['String']['output']>;
  phenotype?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  quality?: Maybe<Scalars['String']['output']>;
  sampleId?: Maybe<Scalars['String']['output']>;
  sequencingRunDate?: Maybe<Scalars['Date']['output']>;
  sequencingRunId?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  truseqIndex?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  workflow?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `CurationLim` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type CurationLimCondition = {
  /** Checks for equality with the object’s `assay` field. */
  assay?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `experimentId` field. */
  experimentId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `externalSampleId` field. */
  externalSampleId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `externalSubjectId` field. */
  externalSubjectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `internalSubjectId` field. */
  internalSubjectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `libraryId` field. */
  libraryId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `loadDatetime` field. */
  loadDatetime?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `ownerId` field. */
  ownerId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `phenotype` field. */
  phenotype?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `quality` field. */
  quality?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sampleId` field. */
  sampleId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<Scalars['Date']['input']>;
  /** Checks for equality with the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `source` field. */
  source?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `truseqIndex` field. */
  truseqIndex?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `workflow` field. */
  workflow?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `CurationLim` object types. All fields are combined with a logical ‘and.’ */
export type CurationLimFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CurationLimFilter>>;
  /** Filter by the object’s `assay` field. */
  assay?: InputMaybe<StringFilter>;
  /** Filter by the object’s `experimentId` field. */
  experimentId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `externalSampleId` field. */
  externalSampleId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `externalSubjectId` field. */
  externalSubjectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `internalSubjectId` field. */
  internalSubjectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `libraryId` field. */
  libraryId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `loadDatetime` field. */
  loadDatetime?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CurationLimFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CurationLimFilter>>;
  /** Filter by the object’s `ownerId` field. */
  ownerId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `phenotype` field. */
  phenotype?: InputMaybe<StringFilter>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `quality` field. */
  quality?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sampleId` field. */
  sampleId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<DateFilter>;
  /** Filter by the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `source` field. */
  source?: InputMaybe<StringFilter>;
  /** Filter by the object’s `truseqIndex` field. */
  truseqIndex?: InputMaybe<StringFilter>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<StringFilter>;
  /** Filter by the object’s `workflow` field. */
  workflow?: InputMaybe<StringFilter>;
};

/** A connection to a list of `CurationLim` values. */
export type CurationLimsConnection = {
  __typename?: 'CurationLimsConnection';
  /** A list of edges which contains the `CurationLim` and cursor to aid in pagination. */
  edges: Array<CurationLimsEdge>;
  /** A list of `CurationLim` objects. */
  nodes: Array<CurationLim>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CurationLim` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `CurationLim` edge in the connection. */
export type CurationLimsEdge = {
  __typename?: 'CurationLimsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `CurationLim` at the end of the edge. */
  node: CurationLim;
};

/** Methods to use when ordering `CurationLim`. */
export enum CurationLimsOrderBy {
  AssayAsc = 'ASSAY_ASC',
  AssayDesc = 'ASSAY_DESC',
  ExperimentIdAsc = 'EXPERIMENT_ID_ASC',
  ExperimentIdDesc = 'EXPERIMENT_ID_DESC',
  ExternalSampleIdAsc = 'EXTERNAL_SAMPLE_ID_ASC',
  ExternalSampleIdDesc = 'EXTERNAL_SAMPLE_ID_DESC',
  ExternalSubjectIdAsc = 'EXTERNAL_SUBJECT_ID_ASC',
  ExternalSubjectIdDesc = 'EXTERNAL_SUBJECT_ID_DESC',
  InternalSubjectIdAsc = 'INTERNAL_SUBJECT_ID_ASC',
  InternalSubjectIdDesc = 'INTERNAL_SUBJECT_ID_DESC',
  LibraryIdAsc = 'LIBRARY_ID_ASC',
  LibraryIdDesc = 'LIBRARY_ID_DESC',
  LoadDatetimeAsc = 'LOAD_DATETIME_ASC',
  LoadDatetimeDesc = 'LOAD_DATETIME_DESC',
  Natural = 'NATURAL',
  OwnerIdAsc = 'OWNER_ID_ASC',
  OwnerIdDesc = 'OWNER_ID_DESC',
  PhenotypeAsc = 'PHENOTYPE_ASC',
  PhenotypeDesc = 'PHENOTYPE_DESC',
  ProjectIdAsc = 'PROJECT_ID_ASC',
  ProjectIdDesc = 'PROJECT_ID_DESC',
  QualityAsc = 'QUALITY_ASC',
  QualityDesc = 'QUALITY_DESC',
  SampleIdAsc = 'SAMPLE_ID_ASC',
  SampleIdDesc = 'SAMPLE_ID_DESC',
  SequencingRunDateAsc = 'SEQUENCING_RUN_DATE_ASC',
  SequencingRunDateDesc = 'SEQUENCING_RUN_DATE_DESC',
  SequencingRunIdAsc = 'SEQUENCING_RUN_ID_ASC',
  SequencingRunIdDesc = 'SEQUENCING_RUN_ID_DESC',
  SourceAsc = 'SOURCE_ASC',
  SourceDesc = 'SOURCE_DESC',
  TruseqIndexAsc = 'TRUSEQ_INDEX_ASC',
  TruseqIndexDesc = 'TRUSEQ_INDEX_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  WorkflowAsc = 'WORKFLOW_ASC',
  WorkflowDesc = 'WORKFLOW_DESC',
}

/** A filter to be used against Date fields. All fields are combined with a logical ‘and.’ */
export type DateFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Date']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Date']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Date']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Date']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Date']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Date']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Date']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Date']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Date']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Date']['input']>>;
};

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Datetime']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Datetime']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Datetime']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Datetime']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Datetime']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Datetime']['input']>>;
};

export type DawsonFastq = {
  __typename?: 'DawsonFastq';
  bucket?: Maybe<Scalars['String']['output']>;
  eTag?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Datetime']['output']>;
  libraryId?: Maybe<Scalars['String']['output']>;
  portalRunId?: Maybe<Scalars['String']['output']>;
  sequencingRunDate?: Maybe<Scalars['Date']['output']>;
  sequencingRunId?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['BigInt']['output']>;
  storageClass?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `DawsonFastq` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type DawsonFastqCondition = {
  /** Checks for equality with the object’s `bucket` field. */
  bucket?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `eTag` field. */
  eTag?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `filename` field. */
  filename?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `format` field. */
  format?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `key` field. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `lastModifiedDate` field. */
  lastModifiedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `libraryId` field. */
  libraryId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `portalRunId` field. */
  portalRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<Scalars['Date']['input']>;
  /** Checks for equality with the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `size` field. */
  size?: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `storageClass` field. */
  storageClass?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `DawsonFastq` object types. All fields are combined with a logical ‘and.’ */
export type DawsonFastqFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<DawsonFastqFilter>>;
  /** Filter by the object’s `bucket` field. */
  bucket?: InputMaybe<StringFilter>;
  /** Filter by the object’s `eTag` field. */
  eTag?: InputMaybe<StringFilter>;
  /** Filter by the object’s `filename` field. */
  filename?: InputMaybe<StringFilter>;
  /** Filter by the object’s `format` field. */
  format?: InputMaybe<StringFilter>;
  /** Filter by the object’s `key` field. */
  key?: InputMaybe<StringFilter>;
  /** Filter by the object’s `lastModifiedDate` field. */
  lastModifiedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `libraryId` field. */
  libraryId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<DawsonFastqFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<DawsonFastqFilter>>;
  /** Filter by the object’s `portalRunId` field. */
  portalRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<DateFilter>;
  /** Filter by the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `size` field. */
  size?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `storageClass` field. */
  storageClass?: InputMaybe<StringFilter>;
};

/** A connection to a list of `DawsonFastq` values. */
export type DawsonFastqsConnection = {
  __typename?: 'DawsonFastqsConnection';
  /** A list of edges which contains the `DawsonFastq` and cursor to aid in pagination. */
  edges: Array<DawsonFastqsEdge>;
  /** A list of `DawsonFastq` objects. */
  nodes: Array<DawsonFastq>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `DawsonFastq` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `DawsonFastq` edge in the connection. */
export type DawsonFastqsEdge = {
  __typename?: 'DawsonFastqsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `DawsonFastq` at the end of the edge. */
  node: DawsonFastq;
};

/** Methods to use when ordering `DawsonFastq`. */
export enum DawsonFastqsOrderBy {
  BucketAsc = 'BUCKET_ASC',
  BucketDesc = 'BUCKET_DESC',
  ETagAsc = 'E_TAG_ASC',
  ETagDesc = 'E_TAG_DESC',
  FilenameAsc = 'FILENAME_ASC',
  FilenameDesc = 'FILENAME_DESC',
  FormatAsc = 'FORMAT_ASC',
  FormatDesc = 'FORMAT_DESC',
  KeyAsc = 'KEY_ASC',
  KeyDesc = 'KEY_DESC',
  LastModifiedDateAsc = 'LAST_MODIFIED_DATE_ASC',
  LastModifiedDateDesc = 'LAST_MODIFIED_DATE_DESC',
  LibraryIdAsc = 'LIBRARY_ID_ASC',
  LibraryIdDesc = 'LIBRARY_ID_DESC',
  Natural = 'NATURAL',
  PortalRunIdAsc = 'PORTAL_RUN_ID_ASC',
  PortalRunIdDesc = 'PORTAL_RUN_ID_DESC',
  SequencingRunDateAsc = 'SEQUENCING_RUN_DATE_ASC',
  SequencingRunDateDesc = 'SEQUENCING_RUN_DATE_DESC',
  SequencingRunIdAsc = 'SEQUENCING_RUN_ID_ASC',
  SequencingRunIdDesc = 'SEQUENCING_RUN_ID_DESC',
  SizeAsc = 'SIZE_ASC',
  SizeDesc = 'SIZE_DESC',
  StorageClassAsc = 'STORAGE_CLASS_ASC',
  StorageClassDesc = 'STORAGE_CLASS_DESC',
}

export type DawsonLim = {
  __typename?: 'DawsonLim';
  assay?: Maybe<Scalars['String']['output']>;
  experimentId?: Maybe<Scalars['String']['output']>;
  externalSampleId?: Maybe<Scalars['String']['output']>;
  externalSubjectId?: Maybe<Scalars['String']['output']>;
  internalSubjectId?: Maybe<Scalars['String']['output']>;
  libraryId?: Maybe<Scalars['String']['output']>;
  loadDatetime?: Maybe<Scalars['Datetime']['output']>;
  ownerId?: Maybe<Scalars['String']['output']>;
  phenotype?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  quality?: Maybe<Scalars['String']['output']>;
  sampleId?: Maybe<Scalars['String']['output']>;
  sequencingRunDate?: Maybe<Scalars['Date']['output']>;
  sequencingRunId?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  truseqIndex?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  workflow?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `DawsonLim` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type DawsonLimCondition = {
  /** Checks for equality with the object’s `assay` field. */
  assay?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `experimentId` field. */
  experimentId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `externalSampleId` field. */
  externalSampleId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `externalSubjectId` field. */
  externalSubjectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `internalSubjectId` field. */
  internalSubjectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `libraryId` field. */
  libraryId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `loadDatetime` field. */
  loadDatetime?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `ownerId` field. */
  ownerId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `phenotype` field. */
  phenotype?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `quality` field. */
  quality?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sampleId` field. */
  sampleId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<Scalars['Date']['input']>;
  /** Checks for equality with the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `source` field. */
  source?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `truseqIndex` field. */
  truseqIndex?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `workflow` field. */
  workflow?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `DawsonLim` object types. All fields are combined with a logical ‘and.’ */
export type DawsonLimFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<DawsonLimFilter>>;
  /** Filter by the object’s `assay` field. */
  assay?: InputMaybe<StringFilter>;
  /** Filter by the object’s `experimentId` field. */
  experimentId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `externalSampleId` field. */
  externalSampleId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `externalSubjectId` field. */
  externalSubjectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `internalSubjectId` field. */
  internalSubjectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `libraryId` field. */
  libraryId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `loadDatetime` field. */
  loadDatetime?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<DawsonLimFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<DawsonLimFilter>>;
  /** Filter by the object’s `ownerId` field. */
  ownerId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `phenotype` field. */
  phenotype?: InputMaybe<StringFilter>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `quality` field. */
  quality?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sampleId` field. */
  sampleId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<DateFilter>;
  /** Filter by the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `source` field. */
  source?: InputMaybe<StringFilter>;
  /** Filter by the object’s `truseqIndex` field. */
  truseqIndex?: InputMaybe<StringFilter>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<StringFilter>;
  /** Filter by the object’s `workflow` field. */
  workflow?: InputMaybe<StringFilter>;
};

/** A connection to a list of `DawsonLim` values. */
export type DawsonLimsConnection = {
  __typename?: 'DawsonLimsConnection';
  /** A list of edges which contains the `DawsonLim` and cursor to aid in pagination. */
  edges: Array<DawsonLimsEdge>;
  /** A list of `DawsonLim` objects. */
  nodes: Array<DawsonLim>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `DawsonLim` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `DawsonLim` edge in the connection. */
export type DawsonLimsEdge = {
  __typename?: 'DawsonLimsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `DawsonLim` at the end of the edge. */
  node: DawsonLim;
};

/** Methods to use when ordering `DawsonLim`. */
export enum DawsonLimsOrderBy {
  AssayAsc = 'ASSAY_ASC',
  AssayDesc = 'ASSAY_DESC',
  ExperimentIdAsc = 'EXPERIMENT_ID_ASC',
  ExperimentIdDesc = 'EXPERIMENT_ID_DESC',
  ExternalSampleIdAsc = 'EXTERNAL_SAMPLE_ID_ASC',
  ExternalSampleIdDesc = 'EXTERNAL_SAMPLE_ID_DESC',
  ExternalSubjectIdAsc = 'EXTERNAL_SUBJECT_ID_ASC',
  ExternalSubjectIdDesc = 'EXTERNAL_SUBJECT_ID_DESC',
  InternalSubjectIdAsc = 'INTERNAL_SUBJECT_ID_ASC',
  InternalSubjectIdDesc = 'INTERNAL_SUBJECT_ID_DESC',
  LibraryIdAsc = 'LIBRARY_ID_ASC',
  LibraryIdDesc = 'LIBRARY_ID_DESC',
  LoadDatetimeAsc = 'LOAD_DATETIME_ASC',
  LoadDatetimeDesc = 'LOAD_DATETIME_DESC',
  Natural = 'NATURAL',
  OwnerIdAsc = 'OWNER_ID_ASC',
  OwnerIdDesc = 'OWNER_ID_DESC',
  PhenotypeAsc = 'PHENOTYPE_ASC',
  PhenotypeDesc = 'PHENOTYPE_DESC',
  ProjectIdAsc = 'PROJECT_ID_ASC',
  ProjectIdDesc = 'PROJECT_ID_DESC',
  QualityAsc = 'QUALITY_ASC',
  QualityDesc = 'QUALITY_DESC',
  SampleIdAsc = 'SAMPLE_ID_ASC',
  SampleIdDesc = 'SAMPLE_ID_DESC',
  SequencingRunDateAsc = 'SEQUENCING_RUN_DATE_ASC',
  SequencingRunDateDesc = 'SEQUENCING_RUN_DATE_DESC',
  SequencingRunIdAsc = 'SEQUENCING_RUN_ID_ASC',
  SequencingRunIdDesc = 'SEQUENCING_RUN_ID_DESC',
  SourceAsc = 'SOURCE_ASC',
  SourceDesc = 'SOURCE_DESC',
  TruseqIndexAsc = 'TRUSEQ_INDEX_ASC',
  TruseqIndexDesc = 'TRUSEQ_INDEX_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  WorkflowAsc = 'WORKFLOW_ASC',
  WorkflowDesc = 'WORKFLOW_DESC',
}

export type Fastq = {
  __typename?: 'Fastq';
  bucket?: Maybe<Scalars['String']['output']>;
  cohortId?: Maybe<Scalars['String']['output']>;
  eTag?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Datetime']['output']>;
  libraryId?: Maybe<Scalars['String']['output']>;
  portalRunId?: Maybe<Scalars['String']['output']>;
  sequencingRunDate?: Maybe<Scalars['Date']['output']>;
  sequencingRunId?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['BigInt']['output']>;
  storageClass?: Maybe<Scalars['String']['output']>;
};

/** A condition to be used against `Fastq` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type FastqCondition = {
  /** Checks for equality with the object’s `bucket` field. */
  bucket?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `cohortId` field. */
  cohortId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `eTag` field. */
  eTag?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `filename` field. */
  filename?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `format` field. */
  format?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `key` field. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `lastModifiedDate` field. */
  lastModifiedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `libraryId` field. */
  libraryId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `portalRunId` field. */
  portalRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<Scalars['Date']['input']>;
  /** Checks for equality with the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `size` field. */
  size?: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `storageClass` field. */
  storageClass?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `Fastq` object types. All fields are combined with a logical ‘and.’ */
export type FastqFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<FastqFilter>>;
  /** Filter by the object’s `bucket` field. */
  bucket?: InputMaybe<StringFilter>;
  /** Filter by the object’s `cohortId` field. */
  cohortId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `eTag` field. */
  eTag?: InputMaybe<StringFilter>;
  /** Filter by the object’s `filename` field. */
  filename?: InputMaybe<StringFilter>;
  /** Filter by the object’s `format` field. */
  format?: InputMaybe<StringFilter>;
  /** Filter by the object’s `key` field. */
  key?: InputMaybe<StringFilter>;
  /** Filter by the object’s `lastModifiedDate` field. */
  lastModifiedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `libraryId` field. */
  libraryId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<FastqFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<FastqFilter>>;
  /** Filter by the object’s `portalRunId` field. */
  portalRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<DateFilter>;
  /** Filter by the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `size` field. */
  size?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `storageClass` field. */
  storageClass?: InputMaybe<StringFilter>;
};

/** A connection to a list of `FastqHistory` values. */
export type FastqHistoriesConnection = {
  __typename?: 'FastqHistoriesConnection';
  /** A list of edges which contains the `FastqHistory` and cursor to aid in pagination. */
  edges: Array<FastqHistoriesEdge>;
  /** A list of `FastqHistory` objects. */
  nodes: Array<FastqHistory>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `FastqHistory` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `FastqHistory` edge in the connection. */
export type FastqHistoriesEdge = {
  __typename?: 'FastqHistoriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `FastqHistory` at the end of the edge. */
  node: FastqHistory;
};

/** Methods to use when ordering `FastqHistory`. */
export enum FastqHistoriesOrderBy {
  BucketAsc = 'BUCKET_ASC',
  BucketDesc = 'BUCKET_DESC',
  CohortIdAsc = 'COHORT_ID_ASC',
  CohortIdDesc = 'COHORT_ID_DESC',
  EffectiveFromAsc = 'EFFECTIVE_FROM_ASC',
  EffectiveFromDesc = 'EFFECTIVE_FROM_DESC',
  EffectiveToAsc = 'EFFECTIVE_TO_ASC',
  EffectiveToDesc = 'EFFECTIVE_TO_DESC',
  Ext1Asc = 'EXT1_ASC',
  Ext1Desc = 'EXT1_DESC',
  Ext2Asc = 'EXT2_ASC',
  Ext2Desc = 'EXT2_DESC',
  Ext3Asc = 'EXT3_ASC',
  Ext3Desc = 'EXT3_DESC',
  ETagAsc = 'E_TAG_ASC',
  ETagDesc = 'E_TAG_DESC',
  FilemanagerAnnotatedAttributesAsc = 'FILEMANAGER_ANNOTATED_ATTRIBUTES_ASC',
  FilemanagerAnnotatedAttributesDesc = 'FILEMANAGER_ANNOTATED_ATTRIBUTES_DESC',
  FilemanagerIngestIdAsc = 'FILEMANAGER_INGEST_ID_ASC',
  FilemanagerIngestIdDesc = 'FILEMANAGER_INGEST_ID_DESC',
  FilemanagerS3ObjectIdAsc = 'FILEMANAGER_S3OBJECT_ID_ASC',
  FilemanagerS3ObjectIdDesc = 'FILEMANAGER_S3OBJECT_ID_DESC',
  FilenameAsc = 'FILENAME_ASC',
  FilenameDesc = 'FILENAME_DESC',
  IsCurrentAsc = 'IS_CURRENT_ASC',
  IsCurrentDesc = 'IS_CURRENT_DESC',
  IsDeletedAsc = 'IS_DELETED_ASC',
  IsDeletedDesc = 'IS_DELETED_DESC',
  KeyAsc = 'KEY_ASC',
  KeyDesc = 'KEY_DESC',
  LastModifiedDateAsc = 'LAST_MODIFIED_DATE_ASC',
  LastModifiedDateDesc = 'LAST_MODIFIED_DATE_DESC',
  LibraryIdAsc = 'LIBRARY_ID_ASC',
  LibraryIdDesc = 'LIBRARY_ID_DESC',
  Natural = 'NATURAL',
  PortalRunIdAsc = 'PORTAL_RUN_ID_ASC',
  PortalRunIdDesc = 'PORTAL_RUN_ID_DESC',
  ReasonAsc = 'REASON_ASC',
  ReasonDesc = 'REASON_DESC',
  SequencingRunIdAsc = 'SEQUENCING_RUN_ID_ASC',
  SequencingRunIdDesc = 'SEQUENCING_RUN_ID_DESC',
  SizeAsc = 'SIZE_ASC',
  SizeDesc = 'SIZE_DESC',
  StorageClassAsc = 'STORAGE_CLASS_ASC',
  StorageClassDesc = 'STORAGE_CLASS_DESC',
}

export type FastqHistory = {
  __typename?: 'FastqHistory';
  bucket?: Maybe<Scalars['String']['output']>;
  cohortId?: Maybe<Scalars['String']['output']>;
  eTag?: Maybe<Scalars['String']['output']>;
  effectiveFrom?: Maybe<Scalars['Datetime']['output']>;
  effectiveTo?: Maybe<Scalars['Datetime']['output']>;
  ext1?: Maybe<Scalars['String']['output']>;
  ext2?: Maybe<Scalars['String']['output']>;
  ext3?: Maybe<Scalars['String']['output']>;
  filemanagerAnnotatedAttributes?: Maybe<Scalars['JSON']['output']>;
  filemanagerIngestId?: Maybe<Scalars['UUID']['output']>;
  filemanagerS3ObjectId?: Maybe<Scalars['UUID']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  isCurrent?: Maybe<Scalars['Int']['output']>;
  isDeleted?: Maybe<Scalars['Int']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Datetime']['output']>;
  libraryId?: Maybe<Scalars['String']['output']>;
  portalRunId?: Maybe<Scalars['String']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  sequencingRunId?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['BigInt']['output']>;
  storageClass?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `FastqHistory` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type FastqHistoryCondition = {
  /** Checks for equality with the object’s `bucket` field. */
  bucket?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `cohortId` field. */
  cohortId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `eTag` field. */
  eTag?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `effectiveFrom` field. */
  effectiveFrom?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `effectiveTo` field. */
  effectiveTo?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `ext1` field. */
  ext1?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `ext2` field. */
  ext2?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `ext3` field. */
  ext3?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `filemanagerAnnotatedAttributes` field. */
  filemanagerAnnotatedAttributes?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `filemanagerIngestId` field. */
  filemanagerIngestId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `filemanagerS3ObjectId` field. */
  filemanagerS3ObjectId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `filename` field. */
  filename?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `isCurrent` field. */
  isCurrent?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `isDeleted` field. */
  isDeleted?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `key` field. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `lastModifiedDate` field. */
  lastModifiedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `libraryId` field. */
  libraryId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `portalRunId` field. */
  portalRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `reason` field. */
  reason?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `size` field. */
  size?: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `storageClass` field. */
  storageClass?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `FastqHistory` object types. All fields are combined with a logical ‘and.’ */
export type FastqHistoryFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<FastqHistoryFilter>>;
  /** Filter by the object’s `bucket` field. */
  bucket?: InputMaybe<StringFilter>;
  /** Filter by the object’s `cohortId` field. */
  cohortId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `eTag` field. */
  eTag?: InputMaybe<StringFilter>;
  /** Filter by the object’s `effectiveFrom` field. */
  effectiveFrom?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `effectiveTo` field. */
  effectiveTo?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `ext1` field. */
  ext1?: InputMaybe<StringFilter>;
  /** Filter by the object’s `ext2` field. */
  ext2?: InputMaybe<StringFilter>;
  /** Filter by the object’s `ext3` field. */
  ext3?: InputMaybe<StringFilter>;
  /** Filter by the object’s `filemanagerAnnotatedAttributes` field. */
  filemanagerAnnotatedAttributes?: InputMaybe<JsonFilter>;
  /** Filter by the object’s `filemanagerIngestId` field. */
  filemanagerIngestId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `filemanagerS3ObjectId` field. */
  filemanagerS3ObjectId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `filename` field. */
  filename?: InputMaybe<StringFilter>;
  /** Filter by the object’s `isCurrent` field. */
  isCurrent?: InputMaybe<IntFilter>;
  /** Filter by the object’s `isDeleted` field. */
  isDeleted?: InputMaybe<IntFilter>;
  /** Filter by the object’s `key` field. */
  key?: InputMaybe<StringFilter>;
  /** Filter by the object’s `lastModifiedDate` field. */
  lastModifiedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `libraryId` field. */
  libraryId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<FastqHistoryFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<FastqHistoryFilter>>;
  /** Filter by the object’s `portalRunId` field. */
  portalRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `reason` field. */
  reason?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `size` field. */
  size?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `storageClass` field. */
  storageClass?: InputMaybe<StringFilter>;
};

/** A connection to a list of `Fastq` values. */
export type FastqsConnection = {
  __typename?: 'FastqsConnection';
  /** A list of edges which contains the `Fastq` and cursor to aid in pagination. */
  edges: Array<FastqsEdge>;
  /** A list of `Fastq` objects. */
  nodes: Array<Fastq>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Fastq` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Fastq` edge in the connection. */
export type FastqsEdge = {
  __typename?: 'FastqsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Fastq` at the end of the edge. */
  node: Fastq;
};

/** Methods to use when ordering `Fastq`. */
export enum FastqsOrderBy {
  BucketAsc = 'BUCKET_ASC',
  BucketDesc = 'BUCKET_DESC',
  CohortIdAsc = 'COHORT_ID_ASC',
  CohortIdDesc = 'COHORT_ID_DESC',
  ETagAsc = 'E_TAG_ASC',
  ETagDesc = 'E_TAG_DESC',
  FilenameAsc = 'FILENAME_ASC',
  FilenameDesc = 'FILENAME_DESC',
  FormatAsc = 'FORMAT_ASC',
  FormatDesc = 'FORMAT_DESC',
  KeyAsc = 'KEY_ASC',
  KeyDesc = 'KEY_DESC',
  LastModifiedDateAsc = 'LAST_MODIFIED_DATE_ASC',
  LastModifiedDateDesc = 'LAST_MODIFIED_DATE_DESC',
  LibraryIdAsc = 'LIBRARY_ID_ASC',
  LibraryIdDesc = 'LIBRARY_ID_DESC',
  Natural = 'NATURAL',
  PortalRunIdAsc = 'PORTAL_RUN_ID_ASC',
  PortalRunIdDesc = 'PORTAL_RUN_ID_DESC',
  SequencingRunDateAsc = 'SEQUENCING_RUN_DATE_ASC',
  SequencingRunDateDesc = 'SEQUENCING_RUN_DATE_DESC',
  SequencingRunIdAsc = 'SEQUENCING_RUN_ID_ASC',
  SequencingRunIdDesc = 'SEQUENCING_RUN_ID_DESC',
  SizeAsc = 'SIZE_ASC',
  SizeDesc = 'SIZE_DESC',
  StorageClassAsc = 'STORAGE_CLASS_ASC',
  StorageClassDesc = 'STORAGE_CLASS_DESC',
}

export type GrimmondLim = {
  __typename?: 'GrimmondLim';
  assay?: Maybe<Scalars['String']['output']>;
  experimentId?: Maybe<Scalars['String']['output']>;
  externalSampleId?: Maybe<Scalars['String']['output']>;
  externalSubjectId?: Maybe<Scalars['String']['output']>;
  internalSubjectId?: Maybe<Scalars['String']['output']>;
  libraryId?: Maybe<Scalars['String']['output']>;
  loadDatetime?: Maybe<Scalars['Datetime']['output']>;
  ownerId?: Maybe<Scalars['String']['output']>;
  phenotype?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  quality?: Maybe<Scalars['String']['output']>;
  sampleId?: Maybe<Scalars['String']['output']>;
  sequencingRunDate?: Maybe<Scalars['Date']['output']>;
  sequencingRunId?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  truseqIndex?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  workflow?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `GrimmondLim` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type GrimmondLimCondition = {
  /** Checks for equality with the object’s `assay` field. */
  assay?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `experimentId` field. */
  experimentId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `externalSampleId` field. */
  externalSampleId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `externalSubjectId` field. */
  externalSubjectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `internalSubjectId` field. */
  internalSubjectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `libraryId` field. */
  libraryId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `loadDatetime` field. */
  loadDatetime?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `ownerId` field. */
  ownerId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `phenotype` field. */
  phenotype?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `quality` field. */
  quality?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sampleId` field. */
  sampleId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<Scalars['Date']['input']>;
  /** Checks for equality with the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `source` field. */
  source?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `truseqIndex` field. */
  truseqIndex?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `workflow` field. */
  workflow?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `GrimmondLim` object types. All fields are combined with a logical ‘and.’ */
export type GrimmondLimFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<GrimmondLimFilter>>;
  /** Filter by the object’s `assay` field. */
  assay?: InputMaybe<StringFilter>;
  /** Filter by the object’s `experimentId` field. */
  experimentId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `externalSampleId` field. */
  externalSampleId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `externalSubjectId` field. */
  externalSubjectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `internalSubjectId` field. */
  internalSubjectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `libraryId` field. */
  libraryId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `loadDatetime` field. */
  loadDatetime?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<GrimmondLimFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<GrimmondLimFilter>>;
  /** Filter by the object’s `ownerId` field. */
  ownerId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `phenotype` field. */
  phenotype?: InputMaybe<StringFilter>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `quality` field. */
  quality?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sampleId` field. */
  sampleId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<DateFilter>;
  /** Filter by the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `source` field. */
  source?: InputMaybe<StringFilter>;
  /** Filter by the object’s `truseqIndex` field. */
  truseqIndex?: InputMaybe<StringFilter>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<StringFilter>;
  /** Filter by the object’s `workflow` field. */
  workflow?: InputMaybe<StringFilter>;
};

/** A connection to a list of `GrimmondLim` values. */
export type GrimmondLimsConnection = {
  __typename?: 'GrimmondLimsConnection';
  /** A list of edges which contains the `GrimmondLim` and cursor to aid in pagination. */
  edges: Array<GrimmondLimsEdge>;
  /** A list of `GrimmondLim` objects. */
  nodes: Array<GrimmondLim>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `GrimmondLim` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `GrimmondLim` edge in the connection. */
export type GrimmondLimsEdge = {
  __typename?: 'GrimmondLimsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `GrimmondLim` at the end of the edge. */
  node: GrimmondLim;
};

/** Methods to use when ordering `GrimmondLim`. */
export enum GrimmondLimsOrderBy {
  AssayAsc = 'ASSAY_ASC',
  AssayDesc = 'ASSAY_DESC',
  ExperimentIdAsc = 'EXPERIMENT_ID_ASC',
  ExperimentIdDesc = 'EXPERIMENT_ID_DESC',
  ExternalSampleIdAsc = 'EXTERNAL_SAMPLE_ID_ASC',
  ExternalSampleIdDesc = 'EXTERNAL_SAMPLE_ID_DESC',
  ExternalSubjectIdAsc = 'EXTERNAL_SUBJECT_ID_ASC',
  ExternalSubjectIdDesc = 'EXTERNAL_SUBJECT_ID_DESC',
  InternalSubjectIdAsc = 'INTERNAL_SUBJECT_ID_ASC',
  InternalSubjectIdDesc = 'INTERNAL_SUBJECT_ID_DESC',
  LibraryIdAsc = 'LIBRARY_ID_ASC',
  LibraryIdDesc = 'LIBRARY_ID_DESC',
  LoadDatetimeAsc = 'LOAD_DATETIME_ASC',
  LoadDatetimeDesc = 'LOAD_DATETIME_DESC',
  Natural = 'NATURAL',
  OwnerIdAsc = 'OWNER_ID_ASC',
  OwnerIdDesc = 'OWNER_ID_DESC',
  PhenotypeAsc = 'PHENOTYPE_ASC',
  PhenotypeDesc = 'PHENOTYPE_DESC',
  ProjectIdAsc = 'PROJECT_ID_ASC',
  ProjectIdDesc = 'PROJECT_ID_DESC',
  QualityAsc = 'QUALITY_ASC',
  QualityDesc = 'QUALITY_DESC',
  SampleIdAsc = 'SAMPLE_ID_ASC',
  SampleIdDesc = 'SAMPLE_ID_DESC',
  SequencingRunDateAsc = 'SEQUENCING_RUN_DATE_ASC',
  SequencingRunDateDesc = 'SEQUENCING_RUN_DATE_DESC',
  SequencingRunIdAsc = 'SEQUENCING_RUN_ID_ASC',
  SequencingRunIdDesc = 'SEQUENCING_RUN_ID_DESC',
  SourceAsc = 'SOURCE_ASC',
  SourceDesc = 'SOURCE_DESC',
  TruseqIndexAsc = 'TRUSEQ_INDEX_ASC',
  TruseqIndexDesc = 'TRUSEQ_INDEX_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  WorkflowAsc = 'WORKFLOW_ASC',
  WorkflowDesc = 'WORKFLOW_DESC',
}

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Int']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

/** A filter to be used against JSON fields. All fields are combined with a logical ‘and.’ */
export type JsonFilter = {
  /** Contained by the specified JSON. */
  containedBy?: InputMaybe<Scalars['JSON']['input']>;
  /** Contains the specified JSON. */
  contains?: InputMaybe<Scalars['JSON']['input']>;
  /** Contains all of the specified keys. */
  containsAllKeys?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Contains any of the specified keys. */
  containsAnyKeys?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Contains the specified key. */
  containsKey?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['JSON']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['JSON']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['JSON']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['JSON']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['JSON']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['JSON']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['JSON']['input']>>;
};

export type Lim = {
  __typename?: 'Lim';
  aliasLibraryId?: Maybe<Scalars['String']['output']>;
  assay?: Maybe<Scalars['String']['output']>;
  experimentId?: Maybe<Scalars['String']['output']>;
  externalSampleId?: Maybe<Scalars['String']['output']>;
  externalSubjectId?: Maybe<Scalars['String']['output']>;
  internalSubjectId?: Maybe<Scalars['String']['output']>;
  libraryId?: Maybe<Scalars['String']['output']>;
  loadDatetime?: Maybe<Scalars['Datetime']['output']>;
  ownerId?: Maybe<Scalars['String']['output']>;
  phenotype?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  quality?: Maybe<Scalars['String']['output']>;
  sampleId?: Maybe<Scalars['String']['output']>;
  sequencingRunDate?: Maybe<Scalars['Date']['output']>;
  sequencingRunId?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  truseqIndex?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  workflow?: Maybe<Scalars['String']['output']>;
};

/** A condition to be used against `Lim` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type LimCondition = {
  /** Checks for equality with the object’s `aliasLibraryId` field. */
  aliasLibraryId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `assay` field. */
  assay?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `experimentId` field. */
  experimentId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `externalSampleId` field. */
  externalSampleId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `externalSubjectId` field. */
  externalSubjectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `internalSubjectId` field. */
  internalSubjectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `libraryId` field. */
  libraryId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `loadDatetime` field. */
  loadDatetime?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `ownerId` field. */
  ownerId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `phenotype` field. */
  phenotype?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `quality` field. */
  quality?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sampleId` field. */
  sampleId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<Scalars['Date']['input']>;
  /** Checks for equality with the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `source` field. */
  source?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `truseqIndex` field. */
  truseqIndex?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `workflow` field. */
  workflow?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `Lim` object types. All fields are combined with a logical ‘and.’ */
export type LimFilter = {
  /** Filter by the object’s `aliasLibraryId` field. */
  aliasLibraryId?: InputMaybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<LimFilter>>;
  /** Filter by the object’s `assay` field. */
  assay?: InputMaybe<StringFilter>;
  /** Filter by the object’s `experimentId` field. */
  experimentId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `externalSampleId` field. */
  externalSampleId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `externalSubjectId` field. */
  externalSubjectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `internalSubjectId` field. */
  internalSubjectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `libraryId` field. */
  libraryId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `loadDatetime` field. */
  loadDatetime?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<LimFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<LimFilter>>;
  /** Filter by the object’s `ownerId` field. */
  ownerId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `phenotype` field. */
  phenotype?: InputMaybe<StringFilter>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `quality` field. */
  quality?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sampleId` field. */
  sampleId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<DateFilter>;
  /** Filter by the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `source` field. */
  source?: InputMaybe<StringFilter>;
  /** Filter by the object’s `truseqIndex` field. */
  truseqIndex?: InputMaybe<StringFilter>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<StringFilter>;
  /** Filter by the object’s `workflow` field. */
  workflow?: InputMaybe<StringFilter>;
};

/** A connection to a list of `Lim` values. */
export type LimsConnection = {
  __typename?: 'LimsConnection';
  /** A list of edges which contains the `Lim` and cursor to aid in pagination. */
  edges: Array<LimsEdge>;
  /** A list of `Lim` objects. */
  nodes: Array<Lim>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Lim` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Lim` edge in the connection. */
export type LimsEdge = {
  __typename?: 'LimsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Lim` at the end of the edge. */
  node: Lim;
};

/** Methods to use when ordering `Lim`. */
export enum LimsOrderBy {
  AliasLibraryIdAsc = 'ALIAS_LIBRARY_ID_ASC',
  AliasLibraryIdDesc = 'ALIAS_LIBRARY_ID_DESC',
  AssayAsc = 'ASSAY_ASC',
  AssayDesc = 'ASSAY_DESC',
  ExperimentIdAsc = 'EXPERIMENT_ID_ASC',
  ExperimentIdDesc = 'EXPERIMENT_ID_DESC',
  ExternalSampleIdAsc = 'EXTERNAL_SAMPLE_ID_ASC',
  ExternalSampleIdDesc = 'EXTERNAL_SAMPLE_ID_DESC',
  ExternalSubjectIdAsc = 'EXTERNAL_SUBJECT_ID_ASC',
  ExternalSubjectIdDesc = 'EXTERNAL_SUBJECT_ID_DESC',
  InternalSubjectIdAsc = 'INTERNAL_SUBJECT_ID_ASC',
  InternalSubjectIdDesc = 'INTERNAL_SUBJECT_ID_DESC',
  LibraryIdAsc = 'LIBRARY_ID_ASC',
  LibraryIdDesc = 'LIBRARY_ID_DESC',
  LoadDatetimeAsc = 'LOAD_DATETIME_ASC',
  LoadDatetimeDesc = 'LOAD_DATETIME_DESC',
  Natural = 'NATURAL',
  OwnerIdAsc = 'OWNER_ID_ASC',
  OwnerIdDesc = 'OWNER_ID_DESC',
  PhenotypeAsc = 'PHENOTYPE_ASC',
  PhenotypeDesc = 'PHENOTYPE_DESC',
  ProjectIdAsc = 'PROJECT_ID_ASC',
  ProjectIdDesc = 'PROJECT_ID_DESC',
  QualityAsc = 'QUALITY_ASC',
  QualityDesc = 'QUALITY_DESC',
  SampleIdAsc = 'SAMPLE_ID_ASC',
  SampleIdDesc = 'SAMPLE_ID_DESC',
  SequencingRunDateAsc = 'SEQUENCING_RUN_DATE_ASC',
  SequencingRunDateDesc = 'SEQUENCING_RUN_DATE_DESC',
  SequencingRunIdAsc = 'SEQUENCING_RUN_ID_ASC',
  SequencingRunIdDesc = 'SEQUENCING_RUN_ID_DESC',
  SourceAsc = 'SOURCE_ASC',
  SourceDesc = 'SOURCE_DESC',
  TruseqIndexAsc = 'TRUSEQ_INDEX_ASC',
  TruseqIndexDesc = 'TRUSEQ_INDEX_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  WorkflowAsc = 'WORKFLOW_ASC',
  WorkflowDesc = 'WORKFLOW_DESC',
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

/** The root query type which gives access points into the data universe. */
export type Query = {
  __typename?: 'Query';
  /** Reads and enables pagination through a set of `Bam`. */
  allBams?: Maybe<BamsConnection>;
  /** Reads and enables pagination through a set of `CurationLim`. */
  allCurationLims?: Maybe<CurationLimsConnection>;
  /** Reads and enables pagination through a set of `DawsonFastq`. */
  allDawsonFastqs?: Maybe<DawsonFastqsConnection>;
  /** Reads and enables pagination through a set of `DawsonLim`. */
  allDawsonLims?: Maybe<DawsonLimsConnection>;
  /** Reads and enables pagination through a set of `FastqHistory`. */
  allFastqHistories?: Maybe<FastqHistoriesConnection>;
  /** Reads and enables pagination through a set of `Fastq`. */
  allFastqs?: Maybe<FastqsConnection>;
  /** Reads and enables pagination through a set of `GrimmondLim`. */
  allGrimmondLims?: Maybe<GrimmondLimsConnection>;
  /** Reads and enables pagination through a set of `Lim`. */
  allLims?: Maybe<LimsConnection>;
  /** Reads and enables pagination through a set of `TothillFastq`. */
  allTothillFastqs?: Maybe<TothillFastqsConnection>;
  /** Reads and enables pagination through a set of `TothillLim`. */
  allTothillLims?: Maybe<TothillLimsConnection>;
  /** Reads and enables pagination through a set of `Workflow`. */
  allWorkflows?: Maybe<WorkflowsConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
};

/** The root query type which gives access points into the data universe. */
export type QueryAllBamsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<BamCondition>;
  filter?: InputMaybe<BamFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<BamsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAllCurationLimsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CurationLimCondition>;
  filter?: InputMaybe<CurationLimFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CurationLimsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAllDawsonFastqsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<DawsonFastqCondition>;
  filter?: InputMaybe<DawsonFastqFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DawsonFastqsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAllDawsonLimsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<DawsonLimCondition>;
  filter?: InputMaybe<DawsonLimFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DawsonLimsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAllFastqHistoriesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<FastqHistoryCondition>;
  filter?: InputMaybe<FastqHistoryFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FastqHistoriesOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAllFastqsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<FastqCondition>;
  filter?: InputMaybe<FastqFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<FastqsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAllGrimmondLimsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<GrimmondLimCondition>;
  filter?: InputMaybe<GrimmondLimFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<GrimmondLimsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAllLimsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<LimCondition>;
  filter?: InputMaybe<LimFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LimsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAllTothillFastqsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TothillFastqCondition>;
  filter?: InputMaybe<TothillFastqFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TothillFastqsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAllTothillLimsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TothillLimCondition>;
  filter?: InputMaybe<TothillLimFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TothillLimsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryAllWorkflowsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<WorkflowCondition>;
  filter?: InputMaybe<WorkflowFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<WorkflowsOrderBy>>;
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']['input']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']['input']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']['input']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
};

export type TothillFastq = {
  __typename?: 'TothillFastq';
  bucket?: Maybe<Scalars['String']['output']>;
  eTag?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Datetime']['output']>;
  libraryId?: Maybe<Scalars['String']['output']>;
  portalRunId?: Maybe<Scalars['String']['output']>;
  sequencingRunDate?: Maybe<Scalars['Date']['output']>;
  sequencingRunId?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['BigInt']['output']>;
  storageClass?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `TothillFastq` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type TothillFastqCondition = {
  /** Checks for equality with the object’s `bucket` field. */
  bucket?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `eTag` field. */
  eTag?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `filename` field. */
  filename?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `format` field. */
  format?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `key` field. */
  key?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `lastModifiedDate` field. */
  lastModifiedDate?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `libraryId` field. */
  libraryId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `portalRunId` field. */
  portalRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<Scalars['Date']['input']>;
  /** Checks for equality with the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `size` field. */
  size?: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `storageClass` field. */
  storageClass?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `TothillFastq` object types. All fields are combined with a logical ‘and.’ */
export type TothillFastqFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TothillFastqFilter>>;
  /** Filter by the object’s `bucket` field. */
  bucket?: InputMaybe<StringFilter>;
  /** Filter by the object’s `eTag` field. */
  eTag?: InputMaybe<StringFilter>;
  /** Filter by the object’s `filename` field. */
  filename?: InputMaybe<StringFilter>;
  /** Filter by the object’s `format` field. */
  format?: InputMaybe<StringFilter>;
  /** Filter by the object’s `key` field. */
  key?: InputMaybe<StringFilter>;
  /** Filter by the object’s `lastModifiedDate` field. */
  lastModifiedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `libraryId` field. */
  libraryId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TothillFastqFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TothillFastqFilter>>;
  /** Filter by the object’s `portalRunId` field. */
  portalRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<DateFilter>;
  /** Filter by the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `size` field. */
  size?: InputMaybe<BigIntFilter>;
  /** Filter by the object’s `storageClass` field. */
  storageClass?: InputMaybe<StringFilter>;
};

/** A connection to a list of `TothillFastq` values. */
export type TothillFastqsConnection = {
  __typename?: 'TothillFastqsConnection';
  /** A list of edges which contains the `TothillFastq` and cursor to aid in pagination. */
  edges: Array<TothillFastqsEdge>;
  /** A list of `TothillFastq` objects. */
  nodes: Array<TothillFastq>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TothillFastq` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TothillFastq` edge in the connection. */
export type TothillFastqsEdge = {
  __typename?: 'TothillFastqsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TothillFastq` at the end of the edge. */
  node: TothillFastq;
};

/** Methods to use when ordering `TothillFastq`. */
export enum TothillFastqsOrderBy {
  BucketAsc = 'BUCKET_ASC',
  BucketDesc = 'BUCKET_DESC',
  ETagAsc = 'E_TAG_ASC',
  ETagDesc = 'E_TAG_DESC',
  FilenameAsc = 'FILENAME_ASC',
  FilenameDesc = 'FILENAME_DESC',
  FormatAsc = 'FORMAT_ASC',
  FormatDesc = 'FORMAT_DESC',
  KeyAsc = 'KEY_ASC',
  KeyDesc = 'KEY_DESC',
  LastModifiedDateAsc = 'LAST_MODIFIED_DATE_ASC',
  LastModifiedDateDesc = 'LAST_MODIFIED_DATE_DESC',
  LibraryIdAsc = 'LIBRARY_ID_ASC',
  LibraryIdDesc = 'LIBRARY_ID_DESC',
  Natural = 'NATURAL',
  PortalRunIdAsc = 'PORTAL_RUN_ID_ASC',
  PortalRunIdDesc = 'PORTAL_RUN_ID_DESC',
  SequencingRunDateAsc = 'SEQUENCING_RUN_DATE_ASC',
  SequencingRunDateDesc = 'SEQUENCING_RUN_DATE_DESC',
  SequencingRunIdAsc = 'SEQUENCING_RUN_ID_ASC',
  SequencingRunIdDesc = 'SEQUENCING_RUN_ID_DESC',
  SizeAsc = 'SIZE_ASC',
  SizeDesc = 'SIZE_DESC',
  StorageClassAsc = 'STORAGE_CLASS_ASC',
  StorageClassDesc = 'STORAGE_CLASS_DESC',
}

export type TothillLim = {
  __typename?: 'TothillLim';
  assay?: Maybe<Scalars['String']['output']>;
  experimentId?: Maybe<Scalars['String']['output']>;
  externalSampleId?: Maybe<Scalars['String']['output']>;
  externalSubjectId?: Maybe<Scalars['String']['output']>;
  internalSubjectId?: Maybe<Scalars['String']['output']>;
  libraryId?: Maybe<Scalars['String']['output']>;
  loadDatetime?: Maybe<Scalars['Datetime']['output']>;
  ownerId?: Maybe<Scalars['String']['output']>;
  phenotype?: Maybe<Scalars['String']['output']>;
  projectId?: Maybe<Scalars['String']['output']>;
  quality?: Maybe<Scalars['String']['output']>;
  sampleId?: Maybe<Scalars['String']['output']>;
  sequencingRunDate?: Maybe<Scalars['Date']['output']>;
  sequencingRunId?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  truseqIndex?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  workflow?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `TothillLim` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type TothillLimCondition = {
  /** Checks for equality with the object’s `assay` field. */
  assay?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `experimentId` field. */
  experimentId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `externalSampleId` field. */
  externalSampleId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `externalSubjectId` field. */
  externalSubjectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `internalSubjectId` field. */
  internalSubjectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `libraryId` field. */
  libraryId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `loadDatetime` field. */
  loadDatetime?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `ownerId` field. */
  ownerId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `phenotype` field. */
  phenotype?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `projectId` field. */
  projectId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `quality` field. */
  quality?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sampleId` field. */
  sampleId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<Scalars['Date']['input']>;
  /** Checks for equality with the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `source` field. */
  source?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `truseqIndex` field. */
  truseqIndex?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `workflow` field. */
  workflow?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `TothillLim` object types. All fields are combined with a logical ‘and.’ */
export type TothillLimFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<TothillLimFilter>>;
  /** Filter by the object’s `assay` field. */
  assay?: InputMaybe<StringFilter>;
  /** Filter by the object’s `experimentId` field. */
  experimentId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `externalSampleId` field. */
  externalSampleId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `externalSubjectId` field. */
  externalSubjectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `internalSubjectId` field. */
  internalSubjectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `libraryId` field. */
  libraryId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `loadDatetime` field. */
  loadDatetime?: InputMaybe<DatetimeFilter>;
  /** Negates the expression. */
  not?: InputMaybe<TothillLimFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<TothillLimFilter>>;
  /** Filter by the object’s `ownerId` field. */
  ownerId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `phenotype` field. */
  phenotype?: InputMaybe<StringFilter>;
  /** Filter by the object’s `projectId` field. */
  projectId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `quality` field. */
  quality?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sampleId` field. */
  sampleId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `sequencingRunDate` field. */
  sequencingRunDate?: InputMaybe<DateFilter>;
  /** Filter by the object’s `sequencingRunId` field. */
  sequencingRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `source` field. */
  source?: InputMaybe<StringFilter>;
  /** Filter by the object’s `truseqIndex` field. */
  truseqIndex?: InputMaybe<StringFilter>;
  /** Filter by the object’s `type` field. */
  type?: InputMaybe<StringFilter>;
  /** Filter by the object’s `workflow` field. */
  workflow?: InputMaybe<StringFilter>;
};

/** A connection to a list of `TothillLim` values. */
export type TothillLimsConnection = {
  __typename?: 'TothillLimsConnection';
  /** A list of edges which contains the `TothillLim` and cursor to aid in pagination. */
  edges: Array<TothillLimsEdge>;
  /** A list of `TothillLim` objects. */
  nodes: Array<TothillLim>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TothillLim` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TothillLim` edge in the connection. */
export type TothillLimsEdge = {
  __typename?: 'TothillLimsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TothillLim` at the end of the edge. */
  node: TothillLim;
};

/** Methods to use when ordering `TothillLim`. */
export enum TothillLimsOrderBy {
  AssayAsc = 'ASSAY_ASC',
  AssayDesc = 'ASSAY_DESC',
  ExperimentIdAsc = 'EXPERIMENT_ID_ASC',
  ExperimentIdDesc = 'EXPERIMENT_ID_DESC',
  ExternalSampleIdAsc = 'EXTERNAL_SAMPLE_ID_ASC',
  ExternalSampleIdDesc = 'EXTERNAL_SAMPLE_ID_DESC',
  ExternalSubjectIdAsc = 'EXTERNAL_SUBJECT_ID_ASC',
  ExternalSubjectIdDesc = 'EXTERNAL_SUBJECT_ID_DESC',
  InternalSubjectIdAsc = 'INTERNAL_SUBJECT_ID_ASC',
  InternalSubjectIdDesc = 'INTERNAL_SUBJECT_ID_DESC',
  LibraryIdAsc = 'LIBRARY_ID_ASC',
  LibraryIdDesc = 'LIBRARY_ID_DESC',
  LoadDatetimeAsc = 'LOAD_DATETIME_ASC',
  LoadDatetimeDesc = 'LOAD_DATETIME_DESC',
  Natural = 'NATURAL',
  OwnerIdAsc = 'OWNER_ID_ASC',
  OwnerIdDesc = 'OWNER_ID_DESC',
  PhenotypeAsc = 'PHENOTYPE_ASC',
  PhenotypeDesc = 'PHENOTYPE_DESC',
  ProjectIdAsc = 'PROJECT_ID_ASC',
  ProjectIdDesc = 'PROJECT_ID_DESC',
  QualityAsc = 'QUALITY_ASC',
  QualityDesc = 'QUALITY_DESC',
  SampleIdAsc = 'SAMPLE_ID_ASC',
  SampleIdDesc = 'SAMPLE_ID_DESC',
  SequencingRunDateAsc = 'SEQUENCING_RUN_DATE_ASC',
  SequencingRunDateDesc = 'SEQUENCING_RUN_DATE_DESC',
  SequencingRunIdAsc = 'SEQUENCING_RUN_ID_ASC',
  SequencingRunIdDesc = 'SEQUENCING_RUN_ID_DESC',
  SourceAsc = 'SOURCE_ASC',
  SourceDesc = 'SOURCE_DESC',
  TruseqIndexAsc = 'TRUSEQ_INDEX_ASC',
  TruseqIndexDesc = 'TRUSEQ_INDEX_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  WorkflowAsc = 'WORKFLOW_ASC',
  WorkflowDesc = 'WORKFLOW_DESC',
}

/** A filter to be used against UUID fields. All fields are combined with a logical ‘and.’ */
export type UuidFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['UUID']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['UUID']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['UUID']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['UUID']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['UUID']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['UUID']['input']>>;
};

export type Workflow = {
  __typename?: 'Workflow';
  libraryId?: Maybe<Scalars['String']['output']>;
  portalRunId?: Maybe<Scalars['String']['output']>;
  workflowComment?: Maybe<Scalars['String']['output']>;
  workflowDuration?: Maybe<Scalars['BigFloat']['output']>;
  workflowEnd?: Maybe<Scalars['Datetime']['output']>;
  workflowName?: Maybe<Scalars['String']['output']>;
  workflowStart?: Maybe<Scalars['Datetime']['output']>;
  workflowStatus?: Maybe<Scalars['String']['output']>;
  workflowVersion?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `Workflow` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type WorkflowCondition = {
  /** Checks for equality with the object’s `libraryId` field. */
  libraryId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `portalRunId` field. */
  portalRunId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `workflowComment` field. */
  workflowComment?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `workflowDuration` field. */
  workflowDuration?: InputMaybe<Scalars['BigFloat']['input']>;
  /** Checks for equality with the object’s `workflowEnd` field. */
  workflowEnd?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `workflowName` field. */
  workflowName?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `workflowStart` field. */
  workflowStart?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `workflowStatus` field. */
  workflowStatus?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `workflowVersion` field. */
  workflowVersion?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against `Workflow` object types. All fields are combined with a logical ‘and.’ */
export type WorkflowFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<WorkflowFilter>>;
  /** Filter by the object’s `libraryId` field. */
  libraryId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<WorkflowFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<WorkflowFilter>>;
  /** Filter by the object’s `portalRunId` field. */
  portalRunId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `workflowComment` field. */
  workflowComment?: InputMaybe<StringFilter>;
  /** Filter by the object’s `workflowDuration` field. */
  workflowDuration?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `workflowEnd` field. */
  workflowEnd?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `workflowName` field. */
  workflowName?: InputMaybe<StringFilter>;
  /** Filter by the object’s `workflowStart` field. */
  workflowStart?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `workflowStatus` field. */
  workflowStatus?: InputMaybe<StringFilter>;
  /** Filter by the object’s `workflowVersion` field. */
  workflowVersion?: InputMaybe<StringFilter>;
};

/** A connection to a list of `Workflow` values. */
export type WorkflowsConnection = {
  __typename?: 'WorkflowsConnection';
  /** A list of edges which contains the `Workflow` and cursor to aid in pagination. */
  edges: Array<WorkflowsEdge>;
  /** A list of `Workflow` objects. */
  nodes: Array<Workflow>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Workflow` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Workflow` edge in the connection. */
export type WorkflowsEdge = {
  __typename?: 'WorkflowsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Workflow` at the end of the edge. */
  node: Workflow;
};

/** Methods to use when ordering `Workflow`. */
export enum WorkflowsOrderBy {
  LibraryIdAsc = 'LIBRARY_ID_ASC',
  LibraryIdDesc = 'LIBRARY_ID_DESC',
  Natural = 'NATURAL',
  PortalRunIdAsc = 'PORTAL_RUN_ID_ASC',
  PortalRunIdDesc = 'PORTAL_RUN_ID_DESC',
  WorkflowCommentAsc = 'WORKFLOW_COMMENT_ASC',
  WorkflowCommentDesc = 'WORKFLOW_COMMENT_DESC',
  WorkflowDurationAsc = 'WORKFLOW_DURATION_ASC',
  WorkflowDurationDesc = 'WORKFLOW_DURATION_DESC',
  WorkflowEndAsc = 'WORKFLOW_END_ASC',
  WorkflowEndDesc = 'WORKFLOW_END_DESC',
  WorkflowNameAsc = 'WORKFLOW_NAME_ASC',
  WorkflowNameDesc = 'WORKFLOW_NAME_DESC',
  WorkflowStartAsc = 'WORKFLOW_START_ASC',
  WorkflowStartDesc = 'WORKFLOW_START_DESC',
  WorkflowStatusAsc = 'WORKFLOW_STATUS_ASC',
  WorkflowStatusDesc = 'WORKFLOW_STATUS_DESC',
  WorkflowVersionAsc = 'WORKFLOW_VERSION_ASC',
  WorkflowVersionDesc = 'WORKFLOW_VERSION_DESC',
}

export type All_LimsQueryVariables = Exact<{
  first?: Scalars['Int']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LimsOrderBy> | LimsOrderBy>;
  filter?: InputMaybe<LimFilter>;
}>;

export type All_LimsQuery = {
  __typename?: 'Query';
  allLims?: {
    __typename?: 'LimsConnection';
    totalCount: number;
    nodes: Array<{
      __typename?: 'Lim';
      libraryId?: string | null;
      workflow?: string | null;
      type?: string | null;
      truseqIndex?: string | null;
      source?: string | null;
      sequencingRunId?: string | null;
      sequencingRunDate?: any | null;
      sampleId?: string | null;
      quality?: string | null;
      projectId?: string | null;
      phenotype?: string | null;
      ownerId?: string | null;
      loadDatetime?: any | null;
      internalSubjectId?: string | null;
      externalSubjectId?: string | null;
      externalSampleId?: string | null;
      experimentId?: string | null;
      assay?: string | null;
      aliasLibraryId?: string | null;
    }>;
  } | null;
};

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const All_LimsDocument = new TypedDocumentString(`
    query all_lims($first: Int! = 10, $offset: Int = 0, $orderBy: [LimsOrderBy!] = [SEQUENCING_RUN_DATE_DESC], $filter: LimFilter) {
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
    `) as unknown as TypedDocumentString<All_LimsQuery, All_LimsQueryVariables>;
