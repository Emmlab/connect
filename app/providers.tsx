'use client';
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider } from '@/components/layout/theme-provider';
import { Toaster } from '@/components/ui/toaster';

/**
 * The Providers component sets up a QueryClient for data fetching, a ThemeProvider
 * for styling, and includes Toaster and ReactQueryDevtools components.
 * @param  - The `Providers` component is a React functional component that serves as a wrapper for
 * providing context and functionality to its children components. Here's a breakdown of the parameters
 * used in the component:
 * @returns The `Providers` component is being returned, which wraps its children with a
 * `ThemeProvider`, `Toaster`, `QueryClientProvider`, and `ReactQueryDevtools`. The `queryClient` is
 * created using `useState` with a `QueryClient` instance that has default options set for queries,
 * including a `staleTime` of 5 minutes.
 */
const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000 * 5,
          },
        },
      })
  );

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <Toaster />
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
