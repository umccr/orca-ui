import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AmplifyAuthContext';
import { Card } from '@/components/common/cards';
import { createApi } from 'unsplash-js';
import { Random } from 'unsplash-js/dist/methods/photos/types';
import { Button } from '@/components/common/buttons';
import { Spinner } from '@/components/common/spinner';
import { env } from '@/utils/commonUtils';

const clientId = env.VITE_UNSPLASH_CLIENT_ID;

function Copyright() {
  return (
    <div className='flex items-center justify-center'>
      <span className='text-white/80'>© </span>
      <a href='https://umccr.org' className='mx-1 text-white/80 underline hover:text-white'>
        UMCCR
      </a>
      <span className='text-white/80'>{new Date().getFullYear()}</span>
    </div>
  );
}

function SignInContainer() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signInWithGoogle } = useAuthContext();

  const loggingIn = () => {
    setIsLoading(true);
    signInWithGoogle();
  };

  return (
    <div className='flex h-full w-full items-center justify-center bg-transparent'>
      <Card
        className='w-[40rem] border border-gray-700/30 bg-gray-900/20 shadow-2xl ring-1 ring-gray-700/30 backdrop-blur-none'
        bodyClassName='bg-gray-900/20'
      >
        <div className='flex items-center justify-center p-[20px]'>
          <img src='/assets/logo/uomlogo.png' className='h-auto w-[30%]' alt='uomlogo.png' />
        </div>
        <div className='px-5 text-center'>
          <h1 className='mb-4 text-[2em] text-white'>UMCCR Orcabus</h1>
          <p className='mb-6 text-left leading-relaxed text-white/80'>
            Led by Professor Sean Grimmond, UMCCR aims to foster innovation and integration in
            cancer care, research, education and training to achieve a world-leading cancer centre
            and workforce.
          </p>
        </div>
        <div className='px-5 pb-5'>
          <Button
            onClick={loggingIn}
            className='w-full rounded-md bg-[#00204E] py-3 text-white shadow-lg transition-colors hover:bg-[#002c6e]'
          >
            {isLoading ? (
              <div className='flex items-center justify-center'>
                <Spinner className='mr-2' />
                <span>Sign in</span>
              </div>
            ) : (
              <span>Sign in</span>
            )}
          </Button>
          <div className='mt-4'>
            <Copyright />
          </div>
        </div>
      </Card>
    </div>
  );
}

function SignInPage() {
  const { isAuthenticated } = useAuthContext();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageLink, setImageLink] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userLink, setUserLink] = useState<string>('');

  useEffect(() => {
    const unsplashApi = createApi({
      apiUrl: 'https://api.unsplash.com',
      headers: { Authorization: 'Client-ID ' + clientId },
    });
    unsplashApi.photos
      .getRandom({
        collectionIds: ['ce-IsXyySA4'],
        count: 1,
      })
      .then((result) => {
        if (result.errors) {
          setImageUrl('iStock-529081597-2.jpg');
        } else {
          const randoms: Random[] = result.response as Random[];
          setImageUrl(randoms[0].urls.regular);
          setImageLink(randoms[0].links.html);
          setUserName(randoms[0].user.username);
          setUserLink(randoms[0].user.links.html);
        }
      })
      .catch(() => {
        setImageUrl('iStock-529081597-2.jpg');
      });
  }, []);

  if (isAuthenticated) {
    return <Navigate replace to='/' />;
  }

  return (
    <div className='absolute h-full w-full overflow-hidden'>
      {!imageUrl && <Spinner className='w-[6px]' />}
      <div
        className='absolute inset-0 bg-gray-900 bg-cover bg-center'
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${imageUrl})`,
        }}
      />
      <div className='relative flex h-full items-center justify-center'>
        <SignInContainer />
      </div>
      {userLink && (
        <div className='fixed right-0 bottom-0 p-5 text-sm text-white/60'>
          Photo by{' '}
          <a
            className='text-white/60 underline hover:text-white'
            href={`${userLink}?utm_source=umccr_data_portal&utm_medium=referral`}
            target='_blank'
            rel='noreferrer'
          >
            {userName}
          </a>{' '}
          on{' '}
          <a
            className='text-white/60 underline hover:text-white'
            href={`${imageLink}?utm_source=umccr_data_portal&utm_medium=referral`}
            target='_blank'
            rel='noreferrer'
          >
            Unsplash
          </a>
        </div>
      )}
    </div>
  );
}

export default SignInPage;
