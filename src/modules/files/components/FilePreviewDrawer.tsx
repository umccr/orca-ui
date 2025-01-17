import { Suspense, useState } from 'react';
import { Drawer } from '@/components/common/drawers';
import {
  FileViewer,
  IGV_FILETYPE_LIST,
  isFileSizeAcceptable,
  isFileViewable,
} from '@/components/files';
import { DetailedErrorBoundary } from '@/components/common/error';
import { getFilenameFromKey } from '@/utils/commonUtils';
import Button from '@/components/common/buttons/Button';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Spinner } from '@/components/common/spinner';
import { S3Record } from '@/api/file';

export const FilePreviewDrawer = ({ s3Record }: { s3Record: S3Record }) => {
  const { key: s3Key, bucket, s3ObjectId, size } = s3Record;
  const [isFilePreview, setIsFilePreview] = useState(false);

  // A special case for IGV viewable size we will not check the size
  // IGV will only request a range byte of the file
  const isIGVFile = !!IGV_FILETYPE_LIST.find((f) => s3Key.endsWith(f));
  const isFileSizeAllowed = isIGVFile || (size && isFileSizeAcceptable(size));

  const isFileAllowed = isFileViewable(s3Key);

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
            {!isFileAllowed ? 'File type is not supported' : 'File size is too large'}
          </span>
          <Button className='!p-2 !m-0 !shadow-none' rounded size='md' type='gray' disabled={true}>
            <EyeSlashIcon className='size-4 ' />
          </Button>
        </div>
      )}
    </>
  );
};
