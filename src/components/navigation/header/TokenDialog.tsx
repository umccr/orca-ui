import { Dialog } from '@/components/common/dialogs';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { SpinnerWithText } from '@/components/common/spinner';
import toaster from '@/components/common/toaster';
import { dayjs } from '@/utils/dayjs';
import { DocumentDuplicateIcon, KeyIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';

type Props = { onClose: () => void };

const TokenDialog = ({ onClose }: Props) => {
  const [jwtData, setJWTData] = useState({ token: '', expires: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancel = false;
    const fetchingNewToken = async () => {
      setIsLoading(true);

      try {
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
      } catch (error) {
        toaster.error({ title: 'Error', message: 'Failed to fetch JWT token: ' + error });
      } finally {
        setIsLoading(false);
      }
    };

    fetchingNewToken();
    return () => {
      cancel = true;
    };
  }, []);

  const handleCopyButton = async () => {
    try {
      await navigator.clipboard.writeText(jwtData.token);
      setCopied(true);
      toaster.success({ title: 'Copied!', message: 'JWT copied to clipboard' });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toaster.error({ title: 'Error', message: 'Failed to copy JWT: ' + error });
    }
  };

  return (
    <Dialog title='JSON Web Token (JWT)' TitleIcon={KeyIcon} open={true} onClose={onClose}>
      {isLoading ? (
        <div className='flex h-40 items-center justify-center'>
          <SpinnerWithText text='Fetching fresh JWT...' />
        </div>
      ) : (
        <div className='max-h-[calc(100vh-16rem)] space-y-6 overflow-y-auto'>
          <div className='rounded-lg border border-yellow-500/20 bg-yellow-50/50 p-4 dark:border-yellow-400/20 dark:bg-yellow-900/20'>
            <div className='flex items-start gap-3'>
              <div className='mt-0.5 rounded-md bg-yellow-100 p-1 dark:bg-yellow-500/20'>
                <KeyIcon
                  className='h-5 w-5 text-yellow-600 dark:text-yellow-400'
                  aria-hidden='true'
                />
              </div>
              <div className='text-sm text-yellow-700 dark:text-yellow-300'>
                <p className='font-medium'>Security Notice</p>
                <p className='mt-1'>
                  This is your personal access token (PAT). Do not share it with any third party!
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='space-y-2'>
              <div className='text-sm font-medium text-gray-700 dark:text-gray-300'>Expires</div>
              <div className='rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-100'>
                {jwtData.expires}
              </div>
            </div>

            <div className='space-y-2'>
              <div className='text-sm font-medium text-gray-700 dark:text-gray-300'>Token</div>
              <div className='group relative'>
                <div className='rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'>
                  <div className='max-h-32 overflow-y-auto px-4 py-2.5'>
                    <code className='break-all font-mono text-sm text-gray-900 dark:text-gray-100'>
                      {jwtData.token}
                    </code>
                  </div>
                </div>
                <button
                  onClick={handleCopyButton}
                  className='absolute right-2 top-2 rounded-md border border-gray-200 bg-white px-2 py-1 text-gray-500 shadow-sm transition-all hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                >
                  {copied ? (
                    <CheckIcon className='h-4 w-4 text-green-500' />
                  ) : (
                    <DocumentDuplicateIcon className='h-4 w-4' />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default TokenDialog;
