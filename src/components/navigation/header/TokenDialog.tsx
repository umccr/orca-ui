import { Dialog } from '@/components/dialogs';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { SpinnerWithText } from '@/components/common/spinner';
import toaster from '@/components/common/toaster';
import dayjs from '@/utils/dayjs';
import { ToastContainer } from 'react-toastify';
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
          <div className='relative w-full h-40'>
            <SpinnerWithText text='Fetching fresh JWT ...' />
          </div>
        ) : (
          <div className='flex flex-col'>
            <ToastContainer />
            <div className='text-red-600 font-bold	bg-gray-300 p-4 border border-black my-4'>
              WARNING: THIS IS YOUR PERSONAL ACCESS TOKEN (PAT). YOU SHOULD NOT SHARE WITH ANY THIRD
              PARTY!
            </div>
            <table className='table-fixed w-full'>
              <tbody>
                <tr className='h-8'>
                  <td className='w-24 font-bold'>EXPIRES</td>
                  <td>{jwtData.expires}</td>
                </tr>
                <tr className='h-8'>
                  <td className='w-24font-bold'>JWT</td>
                  <td className='text-ellipsis text-nowrap overflow-hidden'>{jwtData.token}</td>
                </tr>
                <tr className='h-12'>
                  <td colSpan={2} className='w-24 font-bold'>
                    <Button
                      onClick={handleCopyButton}
                      className='justify-center	w-full inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600'
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
