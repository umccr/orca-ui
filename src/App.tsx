import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Router from '@/router';
import UserProvider from '@/context/UserContext';
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <ToastContainer />
        <Router />
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
