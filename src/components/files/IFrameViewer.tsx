import { usePresignedFileObjectId } from '@/api/file';
import { getMimeType } from './utils';

type Props = { s3ObjectId: string; s3Key: string };
export const IFrameViewer = ({ s3ObjectId, s3Key }: Props) => {
  const url = usePresignedFileObjectId({
    params: {
      path: { id: s3ObjectId },
      query: { responseContentDisposition: 'inline' },
    },
    headers: { 'Content-Type': getMimeType(s3Key) },
  }).data;

  if (!url) throw new Error('Unable to create presigned url');

  return (
    <div className='h-full w-full'>
      <iframe className='h-full w-full bg-white' src={url} />
    </div>
  );
};
