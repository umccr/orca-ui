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

export const DOWNLOADABLE_FILETYPE_LIST: string[] = [
  'vcf.gz',
  'maf',
  ...IMAGE_FILETYPE_LIST,
  ...IFRAME_FILETYPE_LIST,
  ...DELIMITER_SEPARATED_VALUE_FILETYPE_LIST,
  ...PLAIN_FILETYPE_LIST,
  ...OTHER_FILETYPE_LIST,
];

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
  // Only allow to view size less than 20MB - refer to file-manager settings
  if (objectSize < 20000000) {
    return true;
  }
  return false;
};
