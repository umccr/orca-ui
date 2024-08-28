import { FC } from 'react';

const NotFoundPage: FC = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-full bg-gray-100 text-gray-700'>
      <h1 className='text-9xl font-bold'>404</h1>
      <p className='text-2xl mt-4 text-center'>PAGE NOT FOUND</p>
      <p className='mt-2 text-center'>
        {`The Page you are looking for doesn't exist or an other error occurred.`}
        <br />
      </p>
    </div>
  );
};

export default NotFoundPage;
