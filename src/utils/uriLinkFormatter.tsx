import { Link } from 'react-router-dom';

/**
 * Formats URI-like strings into clickable links with proper routing
 * Currently supports:
 * - S3 URIs (s3://bucket/path)
 * - Can be extended for other URI patterns
 */
export const uriLinkFormatter = {
  isValidUri: (value: unknown): boolean => {
    if (typeof value !== 'string') return false;
    try {
      return value.startsWith('s3://') && value.split('/').length >= 3;
    } catch {
      return false;
    }
  },

  formatLink: (value: string): React.JSX.Element => {
    try {
      // Parse URI components safely
      const [, path] = value.split('s3://');
      const [bucket, ...keyParts] = path.split('/');
      const key = keyParts.join('/');

      return (
        <Link
          to={`/files?bucket=${encodeURIComponent(bucket)}&key=${encodeURIComponent(key)}*`}
          className='text-sm font-medium text-blue-500 transition-colors hover:text-blue-700 hover:underline focus:ring-2 focus:ring-blue-500/50 focus:outline-hidden'
          title={`View files in: ${value}`}
        >
          {value}
        </Link>
      );
    } catch (error) {
      // Fallback to plain text if parsing fails
      console.warn('Failed to parse URI:', error);
      return <span className='text-sm text-gray-600'>{value}</span>;
    }
  },
};
