export const statusTextColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-700';
    case 'fail':
      return 'text-red-700';
    case 'warning':
      return 'text-yellow-700';
    case 'abort':
      return 'text-gray-700';
    case 'unknown':
      return 'text-gray-700';
    case 'running':
      return 'text-blue-700';
    default:
      return 'text-indigo-700';
  }
};

export const statusBackgroundColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-100';
    case 'fail':
      return 'bg-red-100';
    case 'warning':
      return 'bg-yellow-100';
    case 'abort':
      return 'bg-gray-100';
    case 'unknown':
      return 'bg-gray-100';
    case 'running':
      return 'bg-blue-100';
    default:
      return 'bg-indigo-100';
  }
};

export const getBadgeStatusType = (status: string) => {
  switch (status.toUpperCase()) {
    case 'REQUESTED':
    case 'QUEUED':
      return 'primary';

    case 'INITIALIZING':
    case 'PREPARING_INPUTS':
    case 'IN PROGRESS':
    case 'READY':
    case 'GENERATING_OUTPUTS':
      return 'running';

    case 'ABORTING':
    case 'ABORTED':
      return 'abort';

    case 'FAILED':
      return 'fail';
    case 'SUCCEEDED':
      return 'success';
    default:
      return 'unknown';
  }
};
