import Router from '@/router';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/context/AmplifyAuthContext';
import { ReactQueryClientProvider } from '@/context/QueryClientContext';
import { ThemeProvider } from '@/context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <ReactQueryClientProvider>
        <AuthProvider>
          <ToastContainer />
          <Router />
        </AuthProvider>
      </ReactQueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
