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

  // Sanitize and split string
  const sanitizeContent: string = data.replace(/\r\n/g, '\n');
  const allRows: string[] = sanitizeContent.split('\n');
  const viewableRows = allRows.slice(0, 1000);

  return (
    <>
      {viewableRows.length > 1000 && (
        <div className='w-full bg-amber-100 text-amber-700 p-2 border mb-3'>
          Only showing the first 1000 rows
        </div>
      )}
      <pre className='overflow-auto inline-block m-0 mt-4 p-3 w-full bg-white border border-solid border-current border-round-xs'>
        {viewableRows.join('\n')}
      </pre>
    </>
  );
};
