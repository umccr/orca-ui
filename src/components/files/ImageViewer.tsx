import { useSuspenseQuery } from '@tanstack/react-query';
import { generatePresignedUrl } from './utils';

type Props = { bucket: string; s3Key: string };
export const ImageViewer = ({ bucket, s3Key: key }: Props) => {
  const url = useSuspenseQuery({
    queryKey: ['generatePresignedUrl', { bucket, key }],
    queryFn: async () => {
      return await generatePresignedUrl({ bucket, key });
    },
  }).data;

  if (!url) throw new Error('No Data');

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
