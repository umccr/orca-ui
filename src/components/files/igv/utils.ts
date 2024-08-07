export const constructIgvNameParameter = ({ key }: { key: string }): string => {
  const filename = key.split('/').pop() ?? key;
  return `${filename}`;
};

export const createIdxFileKey = (key: string): string => {
  if (key.endsWith('bam')) {
    return key + '.bai';
  } else if (key.endsWith('vcf') || key.endsWith('vcf.gz')) {
    return key + '.tbi';
  } else if (key.endsWith('cram')) {
    return key + '.crai';
  } else {
    throw new Error('No index file for this file');
  }
};

export const createIgvFileTrack = ({
  igvName,
  baseFilePresignedUrl,
  idxFilePresignedUrl,
}: {
  igvName: string;
  baseFilePresignedUrl: string;
  idxFilePresignedUrl: string;
}) => {
  const baseTrack = {
    sourceType: 'file',
    url: baseFilePresignedUrl,
    indexURL: idxFilePresignedUrl,
    name: igvName,
  };

  if (igvName.endsWith('vcf') || igvName.endsWith('vcf.gz')) {
    return {
      ...baseTrack,
      type: 'variant',
      format: 'vcf',
    };
  } else if (igvName.endsWith('bam')) {
    return {
      ...baseTrack,
      type: 'alignment',
      format: 'bam',
    };
  } else if (igvName.endsWith('cram')) {
    return {
      ...baseTrack,
      type: 'alignment',
      format: 'cram',
    };
  }
};
