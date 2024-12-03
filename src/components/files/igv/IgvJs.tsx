import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { genomes } from './genomes';
// @ts-expect-error - IGV is not typed
import igv from 'igv';
import { constructIgvNameParameter, createIdxFileKey, createIgvFileTrack } from './utils';
import { Dropdown } from '@/components/common/dropdowns';
import { usePresignedFileList, usePresignedFileObjectId } from '@/api/file';
import { IgvDesktopButton } from './IgvDesktop';

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

  return (
    <div className='w-full h-full flex flex-col'>
      <div className='w-full flex flex-row items-center	justify-between mb-2'>
        <IgvDesktopButton s3ObjectId={s3ObjectId} bucket={bucket} s3Key={s3Key} />
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
