import { XMarkIcon } from '@heroicons/react/20/solid';

interface DownloadProps {
  filename: string;
  content: string;
}

function download({ filename, content }: DownloadProps) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

interface ValidationResponse {
  check_status: string;
  error_message?: string;
  log_file: string;
  v2_sample_sheet?: string;
}

interface DisplayResultProps {
  onClose: () => void;
  validationResponse: ValidationResponse;
}

// Helper function to display results
export default function DisplayResult({ validationResponse, onClose }: DisplayResultProps) {
  const alertVariant =
    validationResponse.check_status === 'PASS'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  const errorMessage = validationResponse.error_message;
  const logFile = validationResponse.log_file;
  const ssv2 = validationResponse.v2_sample_sheet;

  function DisplayFile({ strFile, filename }: { strFile: string; filename: string }) {
    return (
      <>
        <pre className='overflow-auto p-4 bg-gray-100' style={{ maxHeight: '350px' }}>
          {strFile}
        </pre>
        <div className='grid mt-2'>
          <button
            className='border border-current text-gray-700 py-2 px-4 rounded hover:bg-gray-200'
            onClick={() => download({ filename, content: strFile })}
          >
            Save as file
          </button>
        </div>
      </>
    );
  }

  function DisplayErrorMessage({ errorMessage }: { errorMessage: string }) {
    return (
      <div className='my-4'>
        <b>Error: </b> {errorMessage} <br />
      </div>
    );
  }

  return (
    <div className={`relative p-4 rounded ${alertVariant}`}>
      <div className='font-bold text-lg'>
        Check Result: <b>{validationResponse.check_status}</b>
      </div>

      <hr className='my-2 border-current' />

      {errorMessage && <DisplayErrorMessage errorMessage={errorMessage} />}

      <div className='mt-4'>
        <details className='mb-4'>
          <summary className='cursor-pointer font-semibold'>Sample Sheet Check Logs</summary>
          <div className='mt-2'>
            {logFile ? (
              <DisplayFile strFile={logFile} filename={'log.txt'} />
            ) : (
              <div className='italic'>None</div>
            )}
            <div className='mt-3 text-sm font-thin font-serif'>
              *If you want to see more logging, try changing logger option to INFO or DEBUG
            </div>
          </div>
        </details>
        {ssv2 && (
          <details className='mt-6'>
            <summary className='cursor-pointer font-semibold'>Sample Sheet V2</summary>
            <div className='mt-2'>
              <DisplayFile strFile={ssv2} filename={'sampleSheet_v2.csv'} />
            </div>
          </details>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-green-800 hover:text-green-600'
        >
          <XMarkIcon className='h-5 w-5' />
        </button>
      )}
    </div>
  );
}
