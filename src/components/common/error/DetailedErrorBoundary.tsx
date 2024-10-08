import { XMarkIcon } from '@heroicons/react/24/solid';
import { PropsWithChildren } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

type ErrorBoundaryProps = PropsWithChildren & { errorTitle?: string; onCloseError?: () => void };

const DetailedErrorBoundary = ({ children, errorTitle, onCloseError }: ErrorBoundaryProps) => {
  function Fallback({ error, resetErrorBoundary }: FallbackProps) {
    return (
      <div className='my-4 relative p-4 rounded-md bg-gray-50'>
        <div className='flex justify-between w-full'>
          <pre className='font-bold	inline'>{errorTitle ?? `Something went wrong`}</pre>
          <button
            type='button'
            className='rounded-md text-gray-400 hover:text-gray-500 border-2 focus:outline-none	focus:ring-2 focus:ring-inherit focus:ring-offset-2'
            onClick={() => {
              resetErrorBoundary();
              if (onCloseError) onCloseError();
            }}
          >
            <span className='sr-only'>Close</span>
            <XMarkIcon className='h-6 w-6' aria-hidden='true' />
          </button>
        </div>
        <pre style={{ color: 'red' }}>{error.message}</pre>
      </div>
    );
  }

  return <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>;
};

export default DetailedErrorBoundary;
