import { useState } from 'react';
import { constructIgvNameParameter, createIdxFileKey } from './utils';
import { useQueryPresignedFileList, useQueryPresignedFileObjectId } from '@/api/file';
import { Spinner } from '@/components/common/spinner';
import Button from '@/components/common/buttons/Button';
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';
import toaster from '@/components/common/toaster';

type Props = {
  s3ObjectId: string;
  bucket: string;
  s3Key: string;
  className?: string;
  isSimpleRoundedButton?: boolean;
};
export const IgvDesktopButton = ({
  s3ObjectId,
  bucket,
  s3Key,
  className,
  isSimpleRoundedButton,
}: Props) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const idxKey = createIdxFileKey(s3Key);

  // Presign for base and index file
  const useQueryBaseUrl = useQueryPresignedFileObjectId({
    reactQuery: { enabled: isEnabled },
    params: { path: { id: s3ObjectId } },
  });
  const useQueryIdxBaseUrl = useQueryPresignedFileList({
    reactQuery: { enabled: isEnabled },
    params: { query: { bucket, key: idxKey } },
  });

  const isPresignLoading =
    useQueryBaseUrl.isLoading ||
    useQueryBaseUrl.isFetching ||
    useQueryIdxBaseUrl.isLoading ||
    useQueryIdxBaseUrl.isFetching;

  const baseFileSignedUrl = useQueryBaseUrl.data;
  const idxFileSignedUrl =
    useQueryIdxBaseUrl.data?.results.length == 1 ? useQueryIdxBaseUrl.data?.results[0] : null;

  const { isLoading: isOpenLoading } = useQuery({
    queryKey: ['igv', 'open', baseFileSignedUrl, idxFileSignedUrl],
    queryFn: async () => {
      if (!baseFileSignedUrl || !idxFileSignedUrl)
        throw new Error('S3 presigned url not available');

      const igvName = constructIgvNameParameter({ key: s3Key });
      const base = encodeURIComponent(baseFileSignedUrl);
      const idx = encodeURIComponent(idxFileSignedUrl);

      const url = `http://localhost:60151/load?index=${idx}&file=${base}&name=${igvName}`;

      try {
        await fetch(url, { method: 'GET' });
        toaster.success({
          title: 'IGV loaded successfully',
          message: 'File successfully loaded to IGV desktop',
        });
      } catch {
        toaster.error({
          title: 'Unable to connect to IGV local',
          message: 'Please make sure IGV is running on your computer',
        });
      }
      setIsEnabled(false);

      return url;
    },
    enabled: !!baseFileSignedUrl && !!idxFileSignedUrl && isEnabled && !isPresignLoading,
    throwOnError: true,
    staleTime: 0,
  });

  const isAnyLoading = isPresignLoading || isOpenLoading;

  return (
    <div className={className}>
      {isAnyLoading ? (
        <div className='!m-0 !p-2'>
          <Spinner size='small' />
        </div>
      ) : isSimpleRoundedButton ? (
        <Button
          className='!m-0 bg-transparent !p-2 !shadow-none focus:ring-0 focus:ring-offset-0'
          rounded
          size='md'
          type='gray'
          onClick={() => {
            setIsEnabled(true);
          }}
        >
          <ComputerDesktopIcon className='size-4' />
        </Button>
      ) : (
        <Button
          className='!m-0 !p-2'
          size='md'
          onClick={() => {
            setIsEnabled(true);
          }}
        >
          <ComputerDesktopIcon className='size-4' />
          Add track to IGV desktop
        </Button>
      )}
    </div>
  );
};
