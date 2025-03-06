import { useState } from "react";

export const useAsyncStatus = <T>() => {
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any | null>(null);
  const [data, setData] = useState<T[]>([]);
  const [fetch, setFetch] = useState<string>(new Date().toISOString());

  const resetStatus = () => {
    setIsSuccess(null);
    setIsLoading(false);
    setError(null);
    setData([]);
  };

  return {
    isSuccess,
    setIsSuccess,
    isLoading,
    setIsLoading,
    error,
    setError,
    data,
    setData,
    resetStatus,
    fetch,
    setFetch,
  };
};
