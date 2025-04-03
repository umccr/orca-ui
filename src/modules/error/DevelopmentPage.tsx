import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation

const DevelopmentPage = () => {
  const navigate = useNavigate();

  return (
    <div className='flex min-h-full w-full flex-col items-center justify-center bg-gray-100 text-center'>
      <h1 className='text-3xl font-bold text-gray-700'>Page in Development</h1>
      <h1 className='mt-4 text-sm font-semibold text-indigo-500'>🚧 Under Construction</h1>

      <p className='mt-2 text-gray-500'>
        This page is currently being developed. Please check back later or contact support for more
        information.
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

export default DevelopmentPage;
