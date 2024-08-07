import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { generatePresignedUrl } from '../utils';
import { useState } from 'react';
import { genomes } from './genomes';
// @ts-expect-error - IGV is not typed
import igv from 'igv';
import { constructIgvNameParameter, createIdxFileKey, createIgvFileTrack } from './utils';
import { Dropdown } from '@/components/common/dropdowns';

type Props = { bucket: string; s3Key: string };
export const IgvViewer = ({ bucket, s3Key: key }: Props) => {
  const [isInitIgv, setIsInitIgv] = useState(false);
  const idxKey = createIdxFileKey(key);

  const baseFileSignedUrl = useSuspenseQuery({
    queryKey: ['generatePresignedUrl', { bucket, key }],
    queryFn: async () => {
      return await generatePresignedUrl({ bucket, key });
    },
  }).data;

  const idxFileSignedUrl = useSuspenseQuery({
    queryKey: ['generatePresignedUrl', { bucket, idxKey }],
    queryFn: async () => {
      return await generatePresignedUrl({ bucket, key });
    },
  }).data;

  if (!baseFileSignedUrl || !idxFileSignedUrl) throw new Error('No Data');

  const initRefGenome = 'hg38';
  const [refGenome, setRefGenome] = useState<string>(initRefGenome);

  const igvBrowser = useQuery({
    queryKey: ['initIGV'],
    queryFn: async () => {
      const igvDiv = document.getElementById('igv-div');
      if (!igvDiv) throw new Error('No IGV Div Element');

      const igvName = constructIgvNameParameter({ key: key });
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
      <div className='w-full'>
        <p className='inline-block align-middle mr-2'>Reference Genome:</p>
        <Dropdown
          className='w-full'
          label={refGenome}
          items={genomes.map((g) => ({
            label: g.id,
            onClick: () => {
              igvBrowser?.loadGenome(g.id);
              setRefGenome(g.id);
            },
          }))}
        />
      </div>
      <div id='igv-div' />
    </div>
  );
};
