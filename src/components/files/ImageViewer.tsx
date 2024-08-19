import { usePresignedFileObjectId } from '@/api/file';

type Props = { s3ObjectId: string };
export const ImageViewer = ({ s3ObjectId }: Props) => {
  const url = usePresignedFileObjectId({
    params: { path: { id: s3ObjectId }, query: { responseContentDisposition: 'inline' } },
  }).data;

  if (!url) throw new Error('Unable to create presigned url');

  return (
    <div className='w-full h-full text-center'>
      <img
        className='max-w-full max-h-full bg-white'
        onClick={() => window.open(url, '_blank')}
        src={url}
      />
    </div>
  );
};
