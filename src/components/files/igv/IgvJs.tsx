import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { genomes } from './genomes';
// @ts-expect-error - IGV is not typed
import igv from 'igv';
import { constructIgvNameParameter, createIdxFileKey, createIgvFileTrack } from './utils';
import { Dropdown } from '@/components/common/dropdowns';
import { usePresignedFileList, usePresignedFileObjectId } from '@/api/file';
import { IgvDesktopButton } from './IgvDesktop';
import { SpinnerWithText } from '@/components/common/spinner';

type Props = { s3ObjectId: string; bucket: string; s3Key: string };
export const IgvViewer = ({ s3ObjectId, bucket, s3Key }: Props) => {
  const idxKey = createIdxFileKey(s3Key);

  const baseFileSignedUrl = usePresignedFileObjectId({
    params: { path: { id: s3ObjectId } },
  }).data;

  const idxFileSignedUrlResults = usePresignedFileList({
    params: { query: { bucket, key: idxKey } },
  }).data;
  const idxFileSignedUrl =
    idxFileSignedUrlResults?.results.length == 1 ? idxFileSignedUrlResults?.results[0] : null;

  if (!baseFileSignedUrl) throw new Error('Unable to presigned url!');
  if (!idxFileSignedUrl) throw new Error('No index file found!');

  const [isInitIgv, setIsInitIgv] = useState(false);

  const initRefGenome = 'hg38';
  const [refGenome, setRefGenome] = useState<string>(initRefGenome);

  const igvBrowser = useQuery({
    queryKey: ['initIGV'],
    queryFn: async () => {
      const igvDiv = document.getElementById('igv-div');
      if (!igvDiv) throw new Error('No IGV Div Element');

      const igvName = constructIgvNameParameter({ key: s3Key });
      const track = createIgvFileTrack({
        igvName,
        baseFilePresignedUrl: baseFileSignedUrl,
        idxFilePresignedUrl: idxFileSignedUrl,
      });
      if (!track) throw new Error('No IGV Track available');

      const options = {
        genomeList: genomes,
        genome: initRefGenome,
        tracks: [track],
      };

      setIsInitIgv(true);
      return await igv.createBrowser(igvDiv, options);
    },
    enabled: isInitIgv == false,
    refetchOnMount: 'always',
  }).data;

  // Additional loader on init IGV
  // IGV may take a while to load. Display a loader for 3 seconds to indicate that IGV is coming.
  const [isLoadingInitIgv, setIsLoadingInitIgv] = useState(!isInitIgv);
  useEffect(() => {
    setTimeout(() => {
      setIsLoadingInitIgv(false);
    }, 3000);
  }, []);

  return (
    <div className='flex h-full w-full flex-col'>
      <div className='mb-2 flex w-full flex-row items-center justify-between'>
        <IgvDesktopButton s3ObjectId={s3ObjectId} bucket={bucket} s3Key={s3Key} />
        {isLoadingInitIgv && (
          <div className='flex flex-row items-center'>
            <SpinnerWithText className='h-fit w-fit' />
            <div className='ml-4 whitespace-nowrap'>Loading IGV Web ...</div>
          </div>
        )}

        <div>
          <p className='inline-block align-middle'>Reference Genome:</p>
          <Dropdown
            value={refGenome}
            items={genomes.map((g) => ({
              label: g.id,
              onClick: () => {
                igvBrowser?.loadGenome(g.id);
                setRefGenome(g.id);
              },
            }))}
          />
        </div>
      </div>
      <div id='igv-div' />
    </div>
  );
};
