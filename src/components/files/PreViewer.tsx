import { useSuspenseQuery } from '@tanstack/react-query';
import { getPreSignedUrlData } from './utils';
import { usePresignedFileObjectId } from '@/api/file';

type Props = { s3ObjectId: string };
export const PreViewer = ({ s3ObjectId }: Props) => {
  const url = usePresignedFileObjectId({
    params: { path: { id: s3ObjectId }, query: { responseContentDisposition: 'inline' } },
  }).data;
  if (!url) throw new Error('Unable to create presigned url');

  const data = useSuspenseQuery({
    queryKey: ['downloadPresignedData', url],
    queryFn: async () => {
      const data = await getPreSignedUrlData(url);
      return data;
    },
  }).data;
  if (!data) throw new Error('Unable to load data');

  return (
    <div>
      <pre>{data}</pre>
    </div>
  );
};
