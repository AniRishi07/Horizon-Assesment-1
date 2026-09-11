import { useState, useCallback } from 'react';

/**
 * Generic loading-state hook for async operations.
 * Returns [isLoading, execute] where execute wraps any async fn
 * with automatic loading state management.
 */
export function useLoading() {
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      return await fn();
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, execute };
}
