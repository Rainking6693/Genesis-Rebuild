import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface ErrorCardProps {
  id: string;
  title: string;
  message: string;
  timestamp: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ title, message, timestamp }) => {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <strong className="font-bold">{title}</strong>
      <span className="block sm:inline">{message}</span>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">{timestamp}</span>
    </div>
  );
};

const ErrorTrackingComponent: React.FC = () => {
  const [errors, setErrors] = useState<ErrorCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchErrors = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<ErrorCardProps[]> = await axios.get('/api/errors');
      setErrors(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An unexpected error occurred while fetching errors.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchErrors();
  }, [fetchErrors]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Error Tracking</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <strong className="font-bold">Error</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div className="space-y-4">
          {errors.map((error) => (
            <ErrorCard
              key={error.id}
              title={error.title}
              message={error.message}
              timestamp={error.timestamp}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ErrorTrackingComponent;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface ErrorCardProps {
  id: string;
  title: string;
  message: string;
  timestamp: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ title, message, timestamp }) => {
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <strong className="font-bold">{title}</strong>
      <span className="block sm:inline">{message}</span>
      <span className="absolute top-0 bottom-0 right-0 px-4 py-3">{timestamp}</span>
    </div>
  );
};

const ErrorTrackingComponent: React.FC = () => {
  const [errors, setErrors] = useState<ErrorCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchErrors = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<ErrorCardProps[]> = await axios.get('/api/errors');
      setErrors(response.data);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An unexpected error occurred while fetching errors.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchErrors();
  }, [fetchErrors]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Error Tracking</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <strong className="font-bold">Error</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : (
        <div className="space-y-4">
          {errors.map((error) => (
            <ErrorCard
              key={error.id}
              title={error.title}
              message={error.message}
              timestamp={error.timestamp}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ErrorTrackingComponent;