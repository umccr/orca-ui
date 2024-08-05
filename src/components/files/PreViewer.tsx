import { useSuspenseQuery } from '@tanstack/react-query';
import { generatePresignedUrl, getPreSignedUrlData } from './utils';

type Props = { bucket: string; s3Key: string };
export const PreViewer = ({ bucket, s3Key: key }: Props) => {
  const data = useSuspenseQuery({
    queryKey: ['generatePresignedUrl', { bucket, key }],
    queryFn: async () => {
      const url = await generatePresignedUrl({ bucket, key });
      const data = await getPreSignedUrlData(url);
      return data;
    },
  }).data;

  if (!data) throw new Error('No Data');

  return (
    <div>
      <pre>{data}</pre>
    </div>
  );
};
