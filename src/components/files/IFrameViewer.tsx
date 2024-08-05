import { useSuspenseQuery } from '@tanstack/react-query';
import { generatePresignedUrl } from './utils';

type Props = { bucket: string; s3Key: string };
export const IFrameViewer = ({ bucket, s3Key: key }: Props) => {
  const url = useSuspenseQuery({
    queryKey: ['generatePresignedUrl', { bucket, key }],
    queryFn: async () => {
      return await generatePresignedUrl({ bucket, key });
    },
  }).data;

  if (!url) throw new Error('No Data');

  return (
    <div className='w-full h-full'>
      <iframe className='w-full h-full bg-white' src={url} />
    </div>
  );
};
