import React from 'react';
import { ImageViewer } from './ImageViewer';
import { IFrameViewer } from './IFrameViewer';
import { PreViewer } from './PreViewer';

export const IMAGE_FILETYPE_LIST: string[] = ['png', 'jpg', 'jpeg'];
export const IFRAME_FILETYPE_LIST: string[] = ['html', 'pdf'];
export const DELIMITER_SEPARATED_VALUE_FILETYPE_LIST: string[] = ['csv', 'tsv'];
export const PLAIN_FILETYPE_LIST: string[] = ['txt', 'md5sum'];
export const OTHER_FILETYPE_LIST: string[] = ['json', 'yaml'];

type Props = { bucket: string; s3Key: string };

export const FileViewer = (props: Props) => {
  const splitPath = props.s3Key.split('.');
  const filetype = splitPath[splitPath.length - 1].toLowerCase();

  if (IMAGE_FILETYPE_LIST.includes(filetype)) {
    return <ImageViewer {...props} />;
  }

  if (IFRAME_FILETYPE_LIST.includes(filetype)) {
    return <IFrameViewer {...props} />;
  }

  if (OTHER_FILETYPE_LIST.includes(filetype)) {
    return <PreViewer {...props} />;
  }

  return <div>Unsupported Filetype</div>;
};
