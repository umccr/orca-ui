import { usePresignedFileObjectId } from '@/api/file';

type Props = { s3ObjectId: string };
export const IFrameViewer = ({ s3ObjectId }: Props) => {
  const url = usePresignedFileObjectId({
    params: { path: { id: s3ObjectId }, query: { responseContentDisposition: 'inline' } },
  }).data;

  if (!url) throw new Error('Unable to create presigned url');

  return (
    <div className='w-full h-full'>
      <iframe className='w-full h-full bg-white' src={url} />
    </div>
  );
};
