import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

type HttpMethod = 'get' | 'post';

const useAxios = (baseURL: string = '') => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const get = useCallback(
    async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await instance.get<T>(url, config);
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        console.error('GET error:', axiosError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const post = useCallback(
    async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const response = await instance.post<T>(url, data, config);
        return response.data;
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError);
        console.error('POST error:', axiosError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    get,
    post,
    loading,
    error,
  };
};

export default useAxios;
