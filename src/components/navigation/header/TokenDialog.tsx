import { Dialog } from '@/components/common/dialogs';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { SpinnerWithText } from '@/components/common/spinner';
import toaster from '@/components/common/toaster';
import { dayjs } from '@/utils/dayjs';
import { Button } from '@headlessui/react';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';

type Props = { onClose: () => void };

export const TokenDialog = ({ onClose }: Props) => {
  const [jwtData, setJWTData] = useState({ token: '', expires: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let cancel = false;
    const fetchingNewToken = async () => {
      setIsLoading(true);

      const token = (await fetchAuthSession({ forceRefresh: true })).tokens?.idToken;
      if (!token) throw new Error('Cannot create new JWT!');
      const exp = token.payload.exp?.toString();
      if (!exp) throw new Error('Cannot get JWT expiration time!');

      if (cancel) return;

      console.log(' dayjs.unix(parseInt(exp))', dayjs.unix(parseInt(exp)).format('DD/MM/YYYY'));
      setJWTData({
        token: token.toString(),
        expires: dayjs.unix(parseInt(exp)).format('llll Z'),
      });
      setIsLoading(false);
    };

    fetchingNewToken();
    return () => {
      cancel = true;
    };
  }, []);
  const handleCopyButton = () => {
    navigator.clipboard.writeText(jwtData.token);
    toaster.success({ title: 'Copied!', message: 'JWT copied to clipboard' });
  };

  return (
    <Dialog
      open={true}
      onClose={() => onClose()}
      title='JSON Web Token (JWT)'
      content={
        isLoading ? (
          <div className='relative h-40 w-full'>
            <SpinnerWithText text='Fetching fresh JWT ...' />
          </div>
        ) : (
          <div className='flex flex-col'>
            <div className='my-4 border border-black bg-gray-300 p-4 font-bold text-red-600'>
              WARNING: THIS IS YOUR PERSONAL ACCESS TOKEN (PAT). YOU SHOULD NOT SHARE WITH ANY THIRD
              PARTY!
            </div>
            <table className='w-full table-fixed'>
              <tbody>
                <tr className='h-8'>
                  <td className='w-24 font-bold'>EXPIRES</td>
                  <td>{jwtData.expires}</td>
                </tr>
                <tr className='h-8'>
                  <td className='w-24 font-bold'>JWT</td>
                  <td className='overflow-hidden text-ellipsis text-nowrap'>{jwtData.token}</td>
                </tr>
                <tr className='h-12'>
                  <td colSpan={2} className='w-24 font-bold'>
                    <Button
                      onClick={handleCopyButton}
                      className='inline-flex w-full items-center justify-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600'
                    >
                      <DocumentDuplicateIcon className='size-6' />
                      <div>Copy</div>
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      }
    />
  );
};
