/* eslint-disable react-refresh/only-export-components */
// https://github.com/ArnaudBarre/eslint-plugin-react-refresh/issues/25#issuecomment-1729071347

import { ImageViewer } from './ImageViewer';
import { IFrameViewer } from './IFrameViewer';
import { PreViewer } from './PreViewer';
import { TableViewer } from './TableViewer';
import { IgvViewer } from './igv';

export const IMAGE_FILETYPE_LIST: string[] = ['png', 'jpg', 'jpeg'];
export const IFRAME_FILETYPE_LIST: string[] = ['html', 'pdf'];
export const DELIMITER_SEPARATED_VALUE_FILETYPE_LIST: string[] = ['csv', 'tsv'];
export const PLAIN_FILETYPE_LIST: string[] = ['txt', 'md5sum'];
export const OTHER_FILETYPE_LIST: string[] = ['json', 'yaml', 'yml'];
export const IGV_FILETYPE_LIST: string[] = ['bam', 'vcf', 'vcf.gz', 'cram'];

type Props = { bucket: string; s3Key: string; s3ObjectId: string };

export const FileViewer = (props: Props) => {
  const { s3Key } = props;

  if (IMAGE_FILETYPE_LIST.find((f) => s3Key.endsWith(f))) {
    return <ImageViewer {...props} />;
  }

  if (IFRAME_FILETYPE_LIST.find((f) => s3Key.endsWith(f))) {
    return <IFrameViewer {...props} />;
  }

  if (
    PLAIN_FILETYPE_LIST.find((f) => s3Key.endsWith(f)) ||
    OTHER_FILETYPE_LIST.find((f) => s3Key.endsWith(f))
  ) {
    return <PreViewer {...props} />;
  }

  if (DELIMITER_SEPARATED_VALUE_FILETYPE_LIST.find((f) => s3Key.endsWith(f))) {
    return <TableViewer {...props} />;
  }

  if (IGV_FILETYPE_LIST.find((f) => s3Key.endsWith(f))) {
    return <IgvViewer {...props} />;
  }

  return <div>Unsupported Filetype</div>;
};

export const isFileViewable = (s3Key: string): boolean => {
  const filetypeList = [
    ...IMAGE_FILETYPE_LIST,
    ...IFRAME_FILETYPE_LIST,
    ...PLAIN_FILETYPE_LIST,
    ...OTHER_FILETYPE_LIST,
    ...DELIMITER_SEPARATED_VALUE_FILETYPE_LIST,
    ...IGV_FILETYPE_LIST,
  ];
  return !!filetypeList.find((f) => s3Key.endsWith(f));
};

export const isFileSizeAcceptable = (objectSize: number): boolean => {
  // Only allow to view size less than 50MB
  if (objectSize < 50000000) {
    return true;
  }
  return false;
};

export const isFileDownloadable = (s3Key: string): boolean => {
  const filetypeList: string[] = [
    'vcf',
    'maf',
    ...IMAGE_FILETYPE_LIST,
    ...IFRAME_FILETYPE_LIST,
    ...DELIMITER_SEPARATED_VALUE_FILETYPE_LIST,
    ...PLAIN_FILETYPE_LIST,
    ...OTHER_FILETYPE_LIST,
  ];

  // Remove the compressed (`.gz`) extension
  const normalizedKey = s3Key.replace(/\.gz$/, '');

  return !!filetypeList.find((f) => normalizedKey.endsWith(f));
};
