import mimeDb from 'mime-db';

export const getPreSignedUrlData = async (url: string) => {
  const fetchResponse = await fetch(url);

  if (fetchResponse.status < 200 && fetchResponse.status >= 300) {
    throw Error('Non 20X status response from presigned url');
  }

  const responseString = await fetchResponse.text();
  return responseString;
};

export const getMimeType = (filename: string): string => {
  const extension = filename.split('.').pop();
  if (!extension) return 'application/octet-stream';

  for (const [key, value] of Object.entries(mimeDb)) {
    if (value.extensions && value.extensions.includes(extension)) {
      return key;
    }
  }
  return 'application/octet-stream';
};
