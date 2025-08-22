import { TrackLoad, TrackType } from 'igv';
import { fetchAuthSession } from 'aws-amplify/auth';

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

export const constructIgvAuthToken = async () => {
  const accessToken = (await fetchAuthSession()).tokens?.idToken?.toString();
  return { Authorization: `Bearer ${accessToken}` };
};

export const constructHtsGetUrl = ({
  htsGetBaseUrl,
  bucket,
  s3Key,
}: {
  htsGetBaseUrl: string;
  bucket: string;
  s3Key: string;
}) => {
  const s3KeyNoExt = s3Key.replace(/\.vcf\.gz|\.bam|\.cram$/, '');
  if (s3Key.endsWith('.vcf.gz')) {
    return `${htsGetBaseUrl}/variants/${bucket}/${s3KeyNoExt}`;
  } else if (s3Key.endsWith('.bam') || s3Key.endsWith('.cram')) {
    return `${htsGetBaseUrl}/reads/${bucket}/${s3KeyNoExt}`;
  } else {
    throw new Error('Unsupported file type for htsget IGV url');
  }
};

export const createIgvFileTrack = async ({
  igvName,
  baseFileUrl,
  idxFilePresignedUrl,
  sourceType,
}: {
  igvName: string;
  baseFileUrl: string;
  idxFilePresignedUrl: string;
  sourceType: string;
}): Promise<TrackLoad<TrackType>> => {
  const baseTrack = {
    sourceType: sourceType,
    url: baseFileUrl,
    indexURL: idxFilePresignedUrl,
    name: igvName,
    headers: sourceType === 'htsget' ? await constructIgvAuthToken() : undefined,
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
  } else {
    throw new Error('Unsupported file type for IGV track creation');
  }
};
