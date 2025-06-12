import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      networkMode: 'offlineFirst',
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      throwOnError: true,
    },
  },
});

export const ReactQueryClientProvider: FC<PropsWithChildren> = ({ children }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
