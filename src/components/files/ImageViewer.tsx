import { usePresignedFileObjectId } from '@/api/file';
import { getMimeType } from './utils';

type Props = { s3ObjectId: string; s3Key: string };
export const ImageViewer = ({ s3ObjectId, s3Key }: Props) => {
  const url = usePresignedFileObjectId({
    params: { path: { id: s3ObjectId }, query: { responseContentDisposition: 'inline' } },
    headers: { 'Content-Type': getMimeType(s3Key) },
  }).data;

  if (!url) throw new Error('Unable to create presigned url');

  return (
    <div className='h-full w-full text-center'>
      <img
        className='mx-auto max-h-[1000px] max-w-full cursor-pointer bg-white'
        onClick={() => window.open(url, '_blank')}
        src={url}
      />
    </div>
  );
};
