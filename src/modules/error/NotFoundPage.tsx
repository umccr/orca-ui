import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center justify-center min-h-full bg-gray-100 text-gray-700'>
      <h1 className='text-8xl font-bold'>404</h1>
      <p className='text-2xl mt-4 text-center'>PAGE NOT FOUND</p>
      <p className='mt-2 text-center'>
        {`The Page you are looking for doesn't exist or an other error occurred.`}
        <br />
      </p>
      <div className='mt-6 flex space-x-4'>
        <button
          className='bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          onClick={() => navigate('/')}
        >
          Go back home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
