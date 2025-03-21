import { useEffect, useState } from 'react';
import Button from '@/components/common/buttons/Button';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Spinner } from '@/components/common/spinner';
import { S3Record, useQueryPresignedFileObjectId } from '@/api/file';

export const FileOpenInNewTab = ({ s3Record }: { s3Record: S3Record }) => {
  const { s3ObjectId } = s3Record;
  const [isEnabled, setIsEnabled] = useState(false);

  const { data: url, isLoading } = useQueryPresignedFileObjectId({
    params: { path: { id: s3ObjectId }, query: { responseContentDisposition: 'inline' } },
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
          <ArrowTopRightOnSquareIcon className='size-4' />
        </Button>
      )}
    </>
  );
};
