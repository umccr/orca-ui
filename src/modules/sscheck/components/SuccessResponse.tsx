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
        <pre className='overflow-auto bg-gray-100 p-4' style={{ maxHeight: '350px' }}>
          {strFile}
        </pre>
        <div className='mt-2 grid'>
          <button
            className='rounded border border-current px-4 py-2 text-gray-700 hover:bg-gray-200'
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
    <div className={`relative rounded p-4 ${alertVariant}`}>
      <div className='text-lg font-bold'>
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
            <div className='mt-3 font-serif text-sm font-thin'>
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
          className='absolute right-4 top-4 text-green-800 hover:text-green-600'
        >
          <XMarkIcon className='h-5 w-5' />
        </button>
      )}
    </div>
  );
}
