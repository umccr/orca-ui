import Router from '@/router';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/AmplifyAuthContext';
import { ReactQueryClientProvider } from '@/context/QueryClientContext';

function App() {
  return (
    <ReactQueryClientProvider>
      <AuthProvider>
        <ToastContainer />
        <Router />
      </AuthProvider>
    </ReactQueryClientProvider>
  );
}

export default App;
