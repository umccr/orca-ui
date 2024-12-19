import { useSuspenseQuery } from '@tanstack/react-query';
import { getMimeType, getPreSignedUrlData } from './utils';
import { usePresignedFileObjectId } from '@/api/file';

type Props = { s3ObjectId: string; s3Key: string };
export const PreViewer = ({ s3ObjectId, s3Key }: Props) => {
  const url = usePresignedFileObjectId({
    params: { path: { id: s3ObjectId }, query: { responseContentDisposition: 'inline' } },
    headers: { 'Content-Type': getMimeType(s3Key) },
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

  // Sanitize and split string
  const sanitizeContent: string = data.replace(/\r\n/g, '\n');
  const allRows: string[] = sanitizeContent.split('\n');
  const viewableRows = allRows.slice(0, 1000);

  return (
    <>
      {viewableRows.length > 1000 && (
        <div className='mb-3 w-full border bg-amber-100 p-2 text-amber-700'>
          Only showing the first 1000 rows
        </div>
      )}
      <pre className='border-round-xs m-0 mt-4 inline-block w-full overflow-auto border border-solid border-current bg-white p-3'>
        {viewableRows.join('\n')}
      </pre>
    </>
  );
};
