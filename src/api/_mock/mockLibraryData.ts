import { v4 as uuidv4 } from 'uuid'; // Assume UUID for generating unique identifiers

interface LibraryData {
  id: number;
  library_id: string;
  sample_name: string;
  sample_id: string;
  external_sample_id: string;
  subject_id: string;
  external_subject_id: string;
  phenotype: string;
  quality: string;
  source: string;
  project_name: string;
  project_owner: string;
  experiment_id: string;
  type: string;
  assay: string;
  override_cycles: string;
  workflow: string;
  coverage: string;
  truseqindex: string;
}

// Define the enum for different library types
export enum LibraryType {
  WGS = 'WGS',
  WTS = 'WTS',
  ctTSO = 'ctTSO',
  ctDNA = 'ctDNA',
}

// Define the enum for workflow run types
enum WorkflowType {
  DRAGEN_WGS_QC = 'DRAGEN_WGS_QC',
  TUMOR_NORMAL = 'TUMOR_NORMAL',
  UMCCRISE = 'UMCCRISE',
  ONCOANALYSER_WGS = 'ONCOANALYSER_WGS',
  SASH = 'SASH',
  ONCOANALYSER_WGTS_BOTH = 'ONCOANALYSER_WGTS_BOTH',
  DRAGEN_WTS_QC = 'DRAGEN_WTS_QC',
  DRAGEN_WTS = 'DRAGEN_WTS',
  RNASUM = 'RNASUM',
  STAR_ALIGNMENT = 'STAR_ALIGNMENT',
  ONCOANALYSER_WTS = 'ONCOANALYSER_WTS',
  DRAGEN_TSO_CTDNA = 'DRAGEN_TSO_CTDNA',
}

// Mapping of library types to available workflow types
const WORKFLOW_PIPELINE: Record<LibraryType, WorkflowType[]> = {
  [LibraryType.WGS]: [
    WorkflowType.DRAGEN_WGS_QC,
    WorkflowType.TUMOR_NORMAL,
    WorkflowType.UMCCRISE,
    WorkflowType.ONCOANALYSER_WGS,
    WorkflowType.SASH,
    WorkflowType.ONCOANALYSER_WGTS_BOTH,
  ],
  [LibraryType.WTS]: [
    WorkflowType.DRAGEN_WTS_QC,
    WorkflowType.DRAGEN_WTS,
    WorkflowType.RNASUM,
    WorkflowType.STAR_ALIGNMENT,
    WorkflowType.ONCOANALYSER_WTS,
    WorkflowType.ONCOANALYSER_WGTS_BOTH,
  ],
  [LibraryType.ctTSO]: [WorkflowType.DRAGEN_TSO_CTDNA, WorkflowType.UMCCRISE],
  [LibraryType.ctDNA]: [WorkflowType.DRAGEN_TSO_CTDNA, WorkflowType.UMCCRISE],
} as Record<string, WorkflowType[]>;

enum WorkflowStatus {
  Requested = 'Requested',
  Queued = 'Queued',
  Initializing = 'Initializing',
  PreparingInputs = 'Preparing Inputs',
  InProgress = 'In Progress',
  GeneratingOutputs = 'Generating outputs',
  Aborting = 'Aborting',
  Aborted = 'Aborted',
  Failed = 'Failed',
  Succeeded = 'Succeeded',
}

export interface WorkflowRun {
  id: number;
  portal_run_id: string;
  type_name: string;
  wfr_id: string;
  wfl_id: string;
  wfv_id: string;
  version: string;
  input: string;
  start: string;
  wfr_name: string;
  output: string;
  end: string;
  end_status: WorkflowStatus;
  notified: boolean;
  sequence_run: number;
  batch_run: number;
}

interface LibraryRunData {
  id: number;
  library_id: string;
  instrument_run_id: string;
  run_id: string;
  lane: number;
  override_cycles: string;
  coverage_yield: null | number;
  qc_pass: boolean;
  qc_status: null | string;
  valid_for_analysis: boolean;
  workflows: number[];
}

// Mock Library Data Generation
export const generateMockLibraryData = (count: number, libraryType: LibraryType): LibraryData[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: 8877 + i,
    library_id: `L${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`,
    sample_name: `Sample${i}`,
    sample_id: `SampleID${i}`,
    external_sample_id: `External${i}`,
    subject_id: `Subject${i}`,
    external_subject_id: `ExternalSubject${i}`,
    phenotype: 'N/A',
    quality: 'High',
    source: 'Synthetic',
    project_name: 'GenomeProject',
    project_owner: 'GenomicsLab',
    experiment_id: uuidv4(),
    type: libraryType, // All entries will have the specified library type
    assay: 'Sequencing',
    override_cycles: 'Y151;I8;I8;Y151',
    workflow: 'qc',
    coverage: `${Math.random() * 100}`,
    truseqindex: `Index${i}`,
  }));
};

// Generating mock workflow run data
// export const generateMockWorkflowRunData = (
//   count: number,
//   libraryType: LibraryType
// ): WorkflowRun[] => {
//   const finalStatuses = [WorkflowStatus.Aborted, WorkflowStatus.Failed, WorkflowStatus.Succeeded];
//   const possibleWorkflows = WORKFLOW_PIPELINE[libraryType];

//   return Array.from({ length: count }, (_, i) => {
//     const isFinal = Math.random() < 0.3;
//     const status = isFinal
//       ? finalStatuses[Math.floor(Math.random() * finalStatuses.length)]
//       : WorkflowStatus.InProgress;
//     const type_name = possibleWorkflows[Math.floor(Math.random() * possibleWorkflows.length)];

//     return {
//       id: 6500 + i,
//       portal_run_id: `20230423${Math.floor(Math.random() * 1000000)}`,
//       type_name,
//       wfr_id: `wfr.${Math.random().toString(36).substring(7)}`,
//       wfl_id: `wfl.${Math.random().toString(36).substring(7)}`,
//       wfv_id: `wfv.${Math.random().toString(36).substring(7)}`,
//       version: `${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.0--${Math.floor(Math.random() * 10)}--${Math.random().toString(36).substring(2, 8)}`,
//       input: JSON.stringify({ data: 'Sample input data for the workflow' }),
//       start: new Date().toISOString(),
//       wfr_name: `workflow_run_${i}`,
//       output: JSON.stringify({ data: 'Sample output data for the workflow' }),
//       end: new Date().toISOString(),
//       end_status: status,
//       notified: true,
//       sequence_run: Math.floor(Math.random() * 1000),
//       batch_run: Math.floor(Math.random() * 100),
//     };
//   });
// };

// Define a helper to generate mock workflow run details
// export const generateWorkflowRunDetails = (workflowName: string): WorkflowRun => {
//   return {
//     id: Math.floor(Math.random() * 10000),
//     portal_run_id: uuidv4(),
//     type_name: workflowName,
//     version: `${Math.random().toFixed(2)}--release`,
//     start: new Date().toISOString(),
//     end: new Date().toISOString(),
//     end_status: [
//       'Requested',
//       'Queued',
//       'Initializing',
//       'Preparing Inputs',
//       'In Progress',
//       'Generating outputs',
//       'Aborting',
//       'Aborted',
//       'Failed',
//       'Succeeded',
//     ][Math.floor(Math.random() * 10)],
//     notified: Math.random() > 0.5,
//   };
// };

// Mock Library Run Data Generation
//
// Updated Mock Library Run Data Generation
// export const generateMockLibraryRunData = (libraries: LibraryData[]): LibraryRunData[] => {
//   return libraries.flatMap((library) => {
//     const numberOfRuns = Math.floor(Math.random() * 5) + 1; // Random number of runs per library
//     const workflowsForType = WORKFLOW_PIPELINE[library.type]; // Fetch workflows based on library type

//     return Array.from({ length: numberOfRuns }, (_, i) => {
//       const workflowDetailsObject = workflowsForType.reduce(
//         (details, workflow) => {
//           details[workflow] = generateWorkflowRunDetails(workflow);
//           return details;
//         },
//         {} as { [key: string]: WorkflowRun }
//       );

//       return {
//         id: 12500 + i,
//         library_id: library.library_id,
//         instrument_run_id: `Run${Math.floor(Math.random() * 1000)}`,
//         run_id: uuidv4(),
//         lane: Math.ceil(Math.random() * 8), // Random lane number
//         override_cycles: library.override_cycles,
//         coverage_yield: null,
//         qc_pass: Math.random() > 0.5,
//         qc_status: null,
//         valid_for_analysis: Math.random() > 0.5,
//         workflows: workflowsForType.map((_, idx) => 6788 + idx), // Generate workflow IDs
//         libraryDetails: library,
//         workflowsDetails: workflowDetailsObject, // Object of workflow details
//       };
//     });
//   });
// };

//   // Example usage
//   const libraries = generateMockLibraryData(10);
//   const workflows = generateMockWorkflowRunData(20);
//   const libraryRuns = generateMockLibraryRunData(libraries, workflows, 10);

//   console.log(libraryRuns);
//   console.log(libraries);
//   console.log(workflows);

export const generateMockLibraryRunData = (
  count: number,
  libraryType: LibraryType
): LibraryRunData[] => {
  const libraries = generateMockLibraryData(count, libraryType); // Generate specific library data first

  return libraries.flatMap((library) => {
    const numberOfRuns = Math.floor(Math.random() * 5) + 1; // Random number of runs per library
    const workflowsForType = WORKFLOW_PIPELINE[library.type]; // Fetch workflows based on library type

    return Array.from({ length: numberOfRuns }, (_, i) => {
      const workflowDetailsObject = workflowsForType.reduce(
        (details, workflow) => {
          details[workflow] = generateWorkflowRunDetails(workflow);
          return details;
        },
        {} as { [key: string]: WorkflowRunData }
      );

      return {
        id: 12500 + i,
        library_id: library.library_id,
        instrument_run_id: `Run${Math.floor(Math.random() * 1000)}`,
        run_id: uuidv4(),
        lane: Math.ceil(Math.random() * 8), // Random lane number
        override_cycles: library.override_cycles,
        coverage_yield: null,
        qc_pass: Math.random() > 0.5,
        qc_status: null,
        valid_for_analysis: Math.random() > 0.5,
        workflows: workflowsForType.map((_, idx) => 6788 + idx), // Generate workflow IDs
        libraryDetails: library,
        workflowsDetails: workflowDetailsObject, // Object of workflow details
      };
    });
  });
};

// Generate workflow details for a given workflow type
export const generateWorkflowRunDetails = (workflowType: string): WorkflowRunData => {
  return {
    id: Math.floor(Math.random() * 1000),
    portal_run_id: uuidv4(),
    type_name: workflowType,
    version: '1.0.0',
    start: new Date().toISOString(),
    end: new Date().toISOString(),
    end_status: [
      'Requested',
      'Queued',
      'Initializing',
      'Preparing Inputs',
      'In Progress',
      'Generating outputs',
      'Aborting',
      'Aborted',
      'Failed',
      'Succeeded',
    ][Math.floor(Math.random() * 10)],
    notified: Math.random() > 0.5,
  };
};

// LibraryData and WorkflowRunData interfaces need to be defined
//   interface LibraryData {
//     id: number;
//     library_id: string;
//     sample_name: string;
//     sample_id: string;
//     external_sample_id: string;
//     subject_id: string;
//     external_subject_id: string;
//     phenotype: string;
//     quality: string;
//     source: string;
//     project_name: string;
//     project_owner: string;
//     experiment_id: string;
//     type: LibraryType;
//     assay: string;
//     override_cycles: string;
//     workflow: string;
//     coverage: string;
//     truseqindex: string;
//   }

interface WorkflowRunData {
  id: number;
  portal_run_id: string;
  type_name: string;
  version: string;
  start: string;
  end: string;
  end_status: string;
  notified: boolean;
}
