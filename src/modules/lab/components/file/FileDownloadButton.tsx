import React, { useEffect, useState } from 'react';
import Button from '@/components/common/buttons/Button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Spinner } from '@/components/common/spinner';
import { S3Record, useQueryPresignedFileObjectId } from '@/api/file';

export const FileDownloadButton = ({ s3Record }: { s3Record: S3Record }) => {
  const { s3ObjectId } = s3Record;
  const [isEnabled, setIsEnabled] = useState(false);

  const { data: url, isLoading } = useQueryPresignedFileObjectId({
    params: { path: { id: s3ObjectId }, query: { responseContentDisposition: 'attachment' } },
    reactQuery: { enabled: isEnabled },
  });

  useEffect(() => {
    if (url && isEnabled) {
      window.open(url, '_blank');
      setIsEnabled(false);
    }
  }, [url, isEnabled]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Button
          className='!p-2 !m-0 !shadow-none'
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
          <ArrowDownTrayIcon className='size-4 ' />
        </Button>
      )}
    </>
  );
};
