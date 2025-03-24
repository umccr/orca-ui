//  v2 sample sheet structure
//  https://help.connected.illumina.com/run-set-up/overview/sample-sheet-structure
//  https://support.illumina.com/content/dam/illumina-support/documents/documentation/software_documentation/trusight/trusight-oncology-500/200034937-00-dragen-trusight-oncology-ctdna-500-analysis-software-v211-ica-user-guide.pdf
//  https://help.connected.illumina.com/run-set-up/overview/sample-sheet-structure/section-requirements

export interface SampleSheetModel {
  header: HeaderModel;
  reads: ReadsModel;
  sequencing?: SequencingModel;
  bclconvertSettings?: BCLConvertSettingsModel;
  bclconvertData?: BCLConvertDataModel[];
  cloudSettings?: CloudSettingsModel;
  cloudData?: CloudDataModel[];
  tso500lSettings?: TSO500LSettingsModel;
  tso500lData?: TSO500LDataModel[];
  cloudTSO500LSettings?: TSO500LSettingsModel;
  cloudTSO500LData?: TSO500LDataModel[];
  tso500sSettings?: TSO500SSettingsModel;
  tso500sData?: TSO500SDataModel[];
  cloudTSO500SSettings?: TSO500SSettingsModel;
  cloudTSO500SData?: TSO500SDataModel[];
}

export interface HeaderModel {
  fileFormatVersion?: number;
  runName?: string;
  runDescription?: string;
  instrumentPlatform?: string;
  instrumentType?: string;
  indexOrientation?: string;
}

export interface ReadsModel {
  read1Cycles: number;
  read2Cycles?: number;
  index1Cycles?: number;
  index2Cycles?: number;
}

interface SequencingModel {
  customIndex1Primer?: boolean;
  customIndex2Primer?: boolean;
  customRead1Primer?: boolean;
  customRead2Primer?: boolean;
  libraryPrepKits?: string[];
}

export interface BCLConvertSettingsModel {
  adapterBehavior?: string;
  adapterRead1?: string;
  adapterRead2?: string;
  adapterStringency?: number;
  barcodeMismatchesIndex1?: number;
  barcodeMismatchesIndex2?: number;
  minimumTrimmedReadLength?: number;
  minimumAdapterOverlap?: number;
  maskShortReads?: number;
  overrideCycles?: string;
  trimUmi?: boolean;
  createFastqForIndexReads?: boolean;
  noLaneSplitting?: boolean;
  fastqCompressionFormat?: string;
  findAdaptersWithIndels?: boolean;
  independentIndexCollisionCheck?: string[];
  softwareVersion?: string;
  urn?: string;
}

export interface BCLConvertDataModel {
  sampleId: string;
  lane?: number;
  index?: string;
  index2?: string;
  sampleProject?: string;
  sampleName?: string;
  overrideCycles?: string;
  barcodeMismatchesIndex1?: number;
  barcodeMismatchesIndex2?: number;
  adapterRead1?: string;
  adapterRead2?: string;
  adapterBehavior?: string;
  adapterStringency?: number;
  libraryPrepKitName?: string;
  indexAdapterKitName?: string;
}

export interface CloudSettingsModel {
  cloudWorkflow: string;
  generatedVersion?: string;
  [key: string]: string | undefined; // pipeline URNs, example: "bclconvert_pipeline": "urn:illumina.com:bclconvert:1.0"
}

export interface CloudDataModel {
  sampleId?: string;
  projectName?: string;
  libraryName?: string;
  libraryPrepKitName?: string;
  indexAdapterKitName?: string;
}

export interface TSO500LSettingsModel {
  adapterRead1?: string;
  adapterRead2?: string;
  adapterBehavior?: string;
  minimumTrimmedReadLength?: number;
  maskShortReads?: number;
  overrideCycles?: string;
  startsFromFastq?: boolean;
  softwareVersion?: string;
  urn?: string;
}

export interface TSO500LDataModel {
  sampleId: string;
  indexId?: string;
  sampleType: string;
  sampleDescription?: string;
  lane?: number;
  index: string;
  index2: string;
  i7IndexId?: string;
  i5IndexId?: string;
}

export interface TSO500SSettingsModel {
  adapterRead1?: string;
  adapterRead2?: string;
  adapterBehavior?: string;
  minimumTrimmedReadLength?: number;
  maskShortReads?: number;
  overrideCycles?: string;
  startsFromFastq?: boolean;
  softwareVersion?: string;
  urn?: string;
}

export interface TSO500SDataModel {
  sampleId: string;
  indexId?: string;
  sampleType: string;
  sampleFeature?: string;
  sampleDescription?: string;
  lane?: number;
  index: string;
  index2: string;
  pairId: string;
  libraryPrepKitName?: string;
  indexAdapterKitName?: string;
}

// function to tranfer json format sample shett to csv(string format)
export const jsonToCsv = (json: SampleSheetModel): string => {
  const sections: string[] = [];

  // Handle non-array sections (header, reads, settings)
  Object.entries(json).forEach(([key, value]) => {
    if (!key.endsWith('Data') && value && typeof value === 'object') {
      const sectionName = formatSectionName(key);
      const rows = Object.entries(value)
        .map(([k, v]) => `${k},${v}`)
        .join('\n');

      sections.push(`[${sectionName}]\n${rows}\n`);
    }
  });

  // Handle data sections (arrays)
  Object.entries(json).forEach(([key, value]) => {
    if (key.endsWith('Data') && Array.isArray(value) && value.length > 0) {
      const sectionName = formatSectionName(key);
      const columns = Object.keys(value[0]);
      const header = columns.join(',');
      const rows = value
        .map((row) => columns.map((col) => row[col as keyof typeof row]).join(','))
        .join('\n');

      sections.push(`[${sectionName}]\n${header}\n${rows}\n`);
    }
  });

  return sections.join('\n');
};

// Helper function to format section names
const formatSectionName = (key: string): string => {
  // Convert camelCase to proper section name
  // e.g., "bclconvertSettings" -> "BCLConvert_Settings"
  // e.g., "bclconvertData" -> "BCLConvert_Data"
  return key
    .replace(/([A-Z])/g, '_$1') // Add underscore before capitals
    .split('_') // Split into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join('_') // Join with underscore
    .replace(/^_/, ''); // Remove leading underscore if exists
};
