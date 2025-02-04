import {
  ArrowPathIcon,
  BeakerIcon,
  ChartBarIcon,
  CircleStackIcon,
  CloudArrowDownIcon,
  DocumentChartBarIcon,
  DocumentMagnifyingGlassIcon,
  RectangleStackIcon,
  Square3Stack3DIcon,
  WrenchIcon,
} from '@heroicons/react/24/outline';
import { FunctionComponent } from 'react';
import { SVGProps } from 'react';

// Workflow Filter Status Bar
// Only final status applied, https://help.ica.illumina.com/project/p-flow/f-analyses#lifecycle
export const WORKFLOW_STATUS = ['Succeeded', 'Aborted', 'Failed'];

// Workflow filter length for comparison
export const WORKFLOW_STATUS_LENGTH = WORKFLOW_STATUS.length;

export const WorkflowTypeEquivalence: { [key: string]: string } = {
  BCL_CONVERT: 'bcl_convert',
  DRAGEN_WGS_QC: 'wgs_alignment_qc',
  TUMOR_NORMAL: 'wgs_tumor_normal',
  DRAGEN_TSO_CTDNA: 'tso_ctdna_tumor_only',
  DRAGEN_WTS: 'wts_tumor_only',
  UMCCRISE: 'umccrise',
  ONCOANALYSER_WGS: 'oncoanalyser_wgs',
  SASH: 'sash',
  ONCOANALYSER_WGTS_BOTH: 'oncoanalyser_wgts_existing_both',
  DRAGEN_WTS_QC: 'wts_alignment_qc',
  RNASUM: 'rnasum',
  STAR_ALIGNMENT: 'star_alignment',
  ONCOANALYSER_WTS: 'oncoanalyser_wts',
};

// workflow cloud group type
// 'ica-cloud' - ica (DRAGEN) cloud
// 'aws-cloud'
// 'basespace-cloud'
// 'uom-prem-unimelb'
export enum WORKFLOW_CLOUD_COLOR {
  'ica-cloud',
  'aws-cloud',
  'basespace-cloud',
  'uom-prem-unimelb',
}

// Workflow cloud group colors
export enum WorkflowNodeBackground {
  default = 'bg-white',
  unactived = 'bg-gray',
  'ica-cloud' = 'bg-[#B0E3E6]',
  'aws-cloud' = 'bg-[#E3C800]',
  'basespace-cloud' = 'bg-[#D0CEE2]',
  'uom-prem-unimelb' = 'bg-[#FA6800]',
}

// workflow cloud group
export const WORKFLOW_CLOUD: { [key: string]: keyof typeof WorkflowNodeBackground } = {
  Sequencer: 'uom-prem-unimelb',
  BSSH: 'basespace-cloud',
  BCL_CONVERT: 'ica-cloud',
  TSO_CTDNA_TUMOR_ONLY: 'ica-cloud',
  WGS_ALIGNMENT_QC: 'ica-cloud',
  WTS_ALIGNMENT_QC: 'ica-cloud',
  WGS_TUMOR_NORMAL: 'ica-cloud',
  UMCCRISE: 'ica-cloud',
  RNASUM: 'ica-cloud',
  WTS_TUMOR_ONLY: 'ica-cloud',
  STAR_ALIGNMENT: 'aws-cloud',
  PIERIAN_DX: 'aws-cloud',
  HOLMES: 'aws-cloud',
  ONCOANALYSER_WTS: 'aws-cloud',
  GPL: 'aws-cloud',
  ONCOANALYSER_WGS: 'aws-cloud',
  SASH: 'aws-cloud',
  ONCOANALYSER_WGTS_BOTH: 'aws-cloud',
};

// Workflow group
// The key is extracted from metadata type
export const WORKFLOW_PIPELINE: { [key: string]: string[] } = {
  WGS: [
    'DRAGEN_WGS_QC',
    'TUMOR_NORMAL',
    'UMCCRISE',
    'ONCOANALYSER_WGS',
    'SASH',
    'ONCOANALYSER_WGTS_BOTH',
  ],
  WTS: [
    'DRAGEN_WTS_QC',
    'DRAGEN_WTS',
    'RNASUM',
    'STAR_ALIGNMENT',
    'ONCOANALYSER_WTS',
    'ONCOANALYSER_WGTS_BOTH',
  ],
  ctTSO: ['DRAGEN_TSO_CTDNA', 'UMCCRISE'],
  ctDNA: ['DRAGEN_TSO_CTDNA', 'UMCCRISE'],
};

// Workflow Types Available
export const SUPPORTED_PIPELINE = Object.keys(WORKFLOW_PIPELINE);

// Column Display for the Status Table
// Default displayed columns: library_id, subject_id, sample_id, phenotype
export const STATUS_COLUMN_DISPLAY = {
  library_id: true,
  subject_id: true,
  sample_id: true,
  assay: false,
  coverage: false,
  coverage_yield: false,
  experiment_id: false,
  external_sample_id: false,
  external_subject_id: false,
  instrument_run_id: false,
  lane: false,
  override_cycles: false,
  phenotype: true,
  project_name: false,
  project_owner: false,
  qc_pass: false,
  qc_status: false,
  quality: false,
  run_id: false,
  sample_name: false,
  source: false,
  truseqindex: false,
  type: false,
  valid_for_analysis: false,
  workflow: false,
};

// Column Display for the Workflow Table
// Default displayed columns: wfr_name, wfr_id, type_name, end_status, end
export const WORKFLOW_COLUMN_DISPLAY = {
  wfr_name: true,
  wfr_id: true,
  type_name: true,
  end_status: true,
  start: false,
  end: true,
  id: false,
  sample_name: false,
  portal_run_id: false,
  wfl_id: false,
  wfv_id: false,
  version: false,
  input: false,
  output: false,
  notified: false,
  sequence_run: false,
  batch_run: false,
};

export const WORKFLOW_TYPES = [
  'BCL_CONVERT',
  'DRAGEN_WGS_QC',
  'TUMOR_NORMAL',
  'DRAGEN_TSO_CTDNA',
  'DRAGEN_WTS',
  'UMCCRISE',
  'ONCOANALYSER_WGS',
  'SASH',
  'ONCOANALYSER_WGTS_BOTH',
  'DRAGEN_WTS_QC',
  'RNASUM',
  'STAR_ALIGNMENT',
  'ONCOANALYSER_WTS',
  'BSSH_FASTQ_COPY',
  'CTTSOV2',
  'ORA_COMPRESSION',
  'PIERIANDX',
  'WGTS_QC',
  'WTS',
] as const;

export type WorkflowType = (typeof WORKFLOW_TYPES)[number];

// Workflow icon mapping
const WORKFLOW_ICONS: Record<WorkflowType, FunctionComponent<SVGProps<SVGSVGElement>>> = {
  BCL_CONVERT: CircleStackIcon, // Data conversion
  DRAGEN_WGS_QC: DocumentChartBarIcon, // Quality control
  TUMOR_NORMAL: BeakerIcon, // Lab analysis
  DRAGEN_TSO_CTDNA: BeakerIcon, // Lab analysis
  DRAGEN_WTS: ChartBarIcon, // Analysis
  UMCCRISE: DocumentMagnifyingGlassIcon, // Analysis report
  ONCOANALYSER_WGS: ChartBarIcon, // Analysis
  SASH: Square3Stack3DIcon, // Complex analysis
  ONCOANALYSER_WGTS_BOTH: ChartBarIcon, // Combined analysis
  DRAGEN_WTS_QC: DocumentChartBarIcon, // Quality control
  RNASUM: DocumentChartBarIcon, // Summary report
  STAR_ALIGNMENT: ArrowPathIcon, // Alignment process
  ONCOANALYSER_WTS: ChartBarIcon, // Analysis
  BSSH_FASTQ_COPY: CloudArrowDownIcon, // File copy
  CTTSOV2: BeakerIcon, // Lab analysis
  ORA_COMPRESSION: RectangleStackIcon, // Data compression
  PIERIANDX: DocumentChartBarIcon, // Analysis report
  WGTS_QC: DocumentChartBarIcon, // Quality control
  WTS: ChartBarIcon, // Analysis
};

/**
 * Get the appropriate icon for a workflow type
 * @param workflowType The type of workflow
 * @returns The icon component for the workflow
 */
export const getWorkflowIcon = (
  workflowType: string
): FunctionComponent<SVGProps<SVGSVGElement>> => {
  const normalizedType = workflowType.toUpperCase().replace(/-/g, '_') as WorkflowType;
  return WORKFLOW_ICONS[normalizedType] || WrenchIcon; // Default to WrenchIcon if not found
};
