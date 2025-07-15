import { useState, useCallback } from 'react';

export function useImageError(fallbackSrc?: string) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const getSrc = useCallback((originalSrc: string) => {
    if (hasError && fallbackSrc) {
      return fallbackSrc;
    }
    return originalSrc;
  }, [hasError, fallbackSrc]);

  const reset = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
  }, []);

  return {
    hasError,
    isLoading,
    handleError,
    handleLoad,
    getSrc,
    reset,
  };
}
