import { useEffect, useState } from 'react';
import Button from '@/components/common/buttons/Button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Spinner } from '@/components/common/spinner';
import { S3Record, useQueryPresignedFileObjectId } from '@/api/file';
import toaster from '@/components/common/toaster';

export const FileDownloadButton = ({ s3Record }: { s3Record: S3Record }) => {
  const { s3ObjectId } = s3Record;
  const [isEnabled, setIsEnabled] = useState(false);

  const {
    data: url,
    isLoading,
    isError,
    error,
  } = useQueryPresignedFileObjectId({
    params: { path: { id: s3ObjectId }, query: { responseContentDisposition: 'attachment' } },
    reactQuery: { enabled: isEnabled },
  });

  useEffect(() => {
    if (url && isEnabled) {
      window.open(url, '_blank');
      setIsEnabled(false);
    }
  }, [url, isEnabled]);

  useEffect(() => {
    if (isError) {
      toaster.error({ title: 'Unable create presigned url', message: error?.message });
      setIsEnabled(false);
    }
  }, [isError, error]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Button
          className='!m-0 bg-transparent !p-2 !shadow-none focus:ring-0 focus:ring-offset-0'
          rounded
          size='md'
          onClick={() => {
            if (url) {
              window.open(url, '_blank');
            } else {
              setIsEnabled(true);
            }
          }}
          type='gray'
        >
          <ArrowDownTrayIcon className='size-4' />
        </Button>
      )}
    </>
  );
};
