import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className='flex min-h-full flex-col items-center justify-center bg-gray-100 text-gray-700'>
      <h1 className='text-8xl font-bold'>404</h1>
      <p className='mt-4 text-center text-2xl'>PAGE NOT FOUND</p>
      <p className='mt-2 text-center'>
        {`The Page you are looking for doesn't exist or an other error occurred.`}
        <br />
      </p>
      <div className='mt-6 flex space-x-4'>
        <button
          className='rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden'
          onClick={() => navigate('/')}
        >
          Go back home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
