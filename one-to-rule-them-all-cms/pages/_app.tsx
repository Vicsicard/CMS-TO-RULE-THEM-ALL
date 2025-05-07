import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/globals.css';

// Configure console logging to be more visible
if (typeof window !== 'undefined') {
  const originalConsoleError = console.error;
  const originalConsoleLog = console.log;
  const originalConsoleWarn = console.warn;

  // Enhanced logging with timestamp
  console.error = (...args) => {
    const timestamp = new Date().toISOString();
    originalConsoleError.apply(console, [`[ERROR ${timestamp}]`, ...args]);
    // You could also send to an error tracking service here
  };

  console.log = (...args) => {
    const timestamp = new Date().toISOString();
    originalConsoleLog.apply(console, [`[LOG ${timestamp}]`, ...args]);
  };

  console.warn = (...args) => {
    const timestamp = new Date().toISOString();
    originalConsoleWarn.apply(console, [`[WARN ${timestamp}]`, ...args]);
  };
}

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Log when the app renders
    console.log('Application initialized');
    
    // Log browser info for debugging
    console.log('Browser details:', {
      userAgent: navigator.userAgent,
      vendor: navigator.vendor,
      platform: navigator.platform,
      language: navigator.language
    });
    
    // Log if we're having CORS issues
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', event.error || event.message);
    });
    
    return () => {
      window.removeEventListener('error', () => {});
    };
  }, []);

  // Provide a nicer fallback UI for errors
  const ErrorFallback = (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-700 mb-4">
          We're sorry, but there was an error loading the page. Our team has been notified.
        </p>
        <p className="text-gray-600 text-sm mb-6">
          Try refreshing the page or check the browser console for more details.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );

  return (
    <ErrorBoundary fallback={ErrorFallback}>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
