import React, { Suspense, useState } from 'react';
import { Drawer } from '@/components/common/drawers';
import { FileViewer, isFileSizeAcceptable, isFileViewable } from '@/components/files';
import { DetailedErrorBoundary } from '@/components/common/error';
import { getFilenameFromKey } from '@/utils/commonUtils';
import Button from '@/components/common/buttons/Button';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Spinner } from '@/components/common/spinner';
import { S3Record } from '@/api/file';

export const FilePreviewDrawer = ({ s3Record }: { s3Record: S3Record }) => {
  const { key: s3Key, bucket, s3ObjectId, size } = s3Record;
  const [isFilePreview, setIsFilePreview] = useState(false);

  const isFileAllowed = isFileViewable(s3Key);

  // FIX ME: Although we should not limit igv openable file, but since the presign url from FM is configured to 20MB, we
  // would limit this for now.
  const isFileSizeAllowed = size ? isFileSizeAcceptable(size) : false;

  return (
    <>
      {isFileAllowed && isFileSizeAllowed ? (
        <>
          <Drawer
            title={getFilenameFromKey(s3Key)}
            isOpen={isFilePreview}
            setIsOpen={(b) => {
              setIsFilePreview(b);
            }}
            dialogPanelClassName='!max-w-full'
            content={
              <DetailedErrorBoundary errorTitle='Unable to open file viewer'>
                <Suspense fallback={<Spinner />}>
                  <FileViewer bucket={bucket} s3Key={s3Key} s3ObjectId={s3ObjectId} />
                </Suspense>
              </DetailedErrorBoundary>
            }
          />
          <Button
            className='!p-2 !m-0 !shadow-none'
            onClick={() => {
              setIsFilePreview(true);
            }}
            rounded
            size='md'
            type='gray'
            disabled={false}
          >
            <EyeIcon className='size-4' />
          </Button>
        </>
      ) : (
        <div className='relative group'>
          <span className='invisible absolute rounded shadow-lg p-1 bg-gray-100 text-red-500 -mt-8 group-hover:visible group-hover:z-50'>
            {!isFileSizeAllowed ? 'File size is too large' : 'File type is not supported'}
          </span>
          <Button className='!p-2 !m-0 !shadow-none' rounded size='md' type='gray' disabled={true}>
            <EyeSlashIcon className='size-4 ' />
          </Button>
        </div>
      )}
    </>
  );
};
