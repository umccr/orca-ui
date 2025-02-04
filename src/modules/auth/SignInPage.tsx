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
    <div
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
    >
      <p>{'©'}&nbsp;</p>
      <a
        style={{ color: 'white', textDecoration: 'underline', fontSize: 'small' }}
        href='https://umccr.org'
      >
        {'UMCCR'}
      </a>
      &nbsp;
      <p>{new Date().getFullYear()}</p>
    </div>
  );
}

function SignInContainer() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { signInWithGoogle } = useAuthContext();

  const loggingIn = () => {
    setIsLoading(true);

    // signInWithRedirect() will redirect out from page (Not expecting to setIsLoading(false))
    signInWithGoogle();
  };
  const header = (
    <div className='flex items-center justify-center p-[20px]' style={{ padding: '20px' }}>
      <img
        src='/assets/logo/uomlogo.png'
        style={{ width: '30%', height: 'auto' }}
        alt='uomlogo.png'
      />
    </div>
  );

  const footer = (
    <span>
      <Button onClick={() => loggingIn()} className='w-full bg-regal-blue text-center focus:ring-0'>
        {isLoading ? (
          <>
            <Spinner />
            <div className='w-full pr-6 text-center'>Signing</div>
          </>
        ) : (
          <div className='w-full text-center'>Sign in</div>
        )}
      </Button>
      <Copyright />
    </span>
  );

  return (
    <div className='flex h-full w-full items-center justify-center bg-transparent'>
      <Card className='w-[40rem] rounded-lg border border-transparent bg-white bg-opacity-10 p-5 shadow-inner-lg backdrop-blur-sm'>
        {header}
        <div style={{ textAlign: 'justify', color: 'white' }}>
          <h1 style={{ fontSize: '2em', textAlign: 'center' }}>UMCCR Orcabus</h1>
          <p className='m-2' style={{ lineHeight: '1.5' }}>
            Led by Professor Sean Grimmond, UMCCR aims to foster innovation and integration in
            cancer care, research, education and training to achieve a world-leading cancer centre
            and workforce.
          </p>
        </div>
        {footer}
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
          // console.log('error occurred: ', result.errors[0]);
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
        // console.log('fetch error occurred: ', err);
        setImageUrl('iStock-529081597-2.jpg');
      });
  }, []);

  // if user Already signedIn, redirect to HomePage, avoid render signIn page
  if (isAuthenticated) {
    return <Navigate replace to='/' />;
  }

  return (
    <div className='absolute h-full w-full overflow-hidden'>
      {!imageUrl && <Spinner className='w-[6px]' />}
      <div
        className='bg-grey -z-1 bg-[url(imageUrl) bg-center] absolute h-full w-full bg-cover bg-no-repeat'
        style={{
          backgroundColor: 'grey',
          height: '100%',
          width: '100%',
          zIndex: -1,
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)), url(' + imageUrl + ')',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className='z-1 flex h-full items-center justify-center'>
        <SignInContainer />
      </div>
      {userLink && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            right: 0,
            padding: '20px',
            fontSize: 'small',
            color: 'lightgrey',
          }}
        >
          Photo by&nbsp;
          <a
            style={{ fontSize: 'small', color: 'lightgrey', textDecoration: 'underline' }}
            href={userLink + '?utm_source=umccr_data_portal&utm_medium=referral'}
            target={'_blank'}
            rel='noreferrer'
          >
            {userName}
          </a>
          &nbsp;on&nbsp;
          <a
            style={{ fontSize: 'small', color: 'lightgrey', textDecoration: 'underline' }}
            href={imageLink + '?utm_source=umccr_data_portal&utm_medium=referral'}
            target={'_blank'}
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
