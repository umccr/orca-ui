export const generatePresignedUrl = async (props: { bucket: string; key: string }) => {
  console.log('Generating presigned url for', props);
  return 'http://...';
};

export const getPreSignedUrlData = async (url: string) => {
  const fetchResponse = await fetch(url);

  if (fetchResponse.status < 200 && fetchResponse.status >= 300) {
    throw Error('Non 20X status response from presigned url');
  }

  const responseString = await fetchResponse.text();
  return responseString;
};
