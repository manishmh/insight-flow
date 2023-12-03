// useAsync.ts
import { useState, useEffect } from 'react';

export default function useAsync<TData, TError = any>(
  asyncFunction: () => Promise<TData>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<TError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const execute = async () => {
    try {
      setLoading(true);
      const result = await asyncFunction();
      setData(result);
    } catch (error) {
      setError(error as TError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    execute();
    
  }, dependencies);

  return { data, error, loading };
}
