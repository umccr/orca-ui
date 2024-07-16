function App() {
  return (
    <>
      <h1 className='text-3xl py-5'>Under development</h1>
      <h1 className='text-3xl py-5'>{import.meta.env.VITE_BUCKET_NAME}</h1>
      <h1 className='text-3xl py-5'>{import.meta.env.VITE_HOSTED_ID}</h1>
    </>
  );
}

export default App;
