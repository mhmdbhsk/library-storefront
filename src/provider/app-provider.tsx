'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface AppProviderProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export default function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <ReactQueryDevtools initialIsOpen={false} />
      <ProgressBar
        height='2px'
        color='#000'
        options={{ showSpinner: false }}
        shallowRouting
      />
    </QueryClientProvider>
  );
}
