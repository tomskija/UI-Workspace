import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { apiManager } from '@/lib/api/manager';
import { workspaceConfig } from '@/lib/config/workspace';

export default function App({ Component, pageProps }: AppProps) {
  // Create a client
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          // With SSR, we usually want to set some default staleTime
          // above 0 to avoid refetching immediately on the client
          staleTime: 60 * 1000,
          retry: (failureCount, error: any) => {
            // Don't retry on 4xx errors
            if (error?.response?.status >= 400 && error?.response?.status < 500) {
              return false;
            }
            // Retry up to 3 times for other errors
            return failureCount < 3;
          },
        },
      },
    })
  );

  // Check backend connections on mount
  useEffect(() => {
    const checkConnections = async () => {
      try {
        const health = await apiManager.healthCheckAll();
        console.log('🔍 Workspace backend health check:', health);
      } catch (error) {
        console.warn('⚠️ Some backends may be unavailable:', error);
      }
    };

    checkConnections();
  }, []);

  return (
    <>
      <Head>
        <title>{workspaceConfig.name} - Multi-Backend UI Workspace</title>
        <meta name="description" content="Generic UI workspace for multiple Python backend services. Modular, scalable, and extensible interface for data processing, analytics, and computation." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1E293B" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <Component {...pageProps} />
        </div>
        
        {/* React Query Devtools - only in development */}
        {process.env.NODE_ENV === 'development' && workspaceConfig.features.devTools && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </>
  );
}