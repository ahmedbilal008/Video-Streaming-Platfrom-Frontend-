'use client';

import { useState, useCallback } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

export default function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiFunction, ...args) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const LoadingComponent = isLoading ? <LoadingSpinner /> : null;
  const ErrorComponent = error ? <ErrorAlert message={error} /> : null;

  return { callApi, LoadingComponent, ErrorComponent };
}

