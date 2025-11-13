import React, { FC, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ESGData } from './ESGData';
import { ApiErrorContext } from './ApiErrorContext';

// Custom AxiosInstance for better configuration and error handling
const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    // Add any necessary headers here
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors here, e.g. displaying a custom error message to the user
    console.error(error);
    return Promise.reject(error);
  }
);

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const { setApiError } = useContext(ApiErrorContext);
  const [esgData, setESGData] = useState<ESGData | null>(null);
  const [loading, setLoading] = useState(true);

  const handleOffsetPurchase = useCallback(async () => {
    try {
      await axiosInstance.post('/offset-purchase');
      // Handle successful purchase
    } catch (error) {
      setApiError(error.message);
    }
  }, []);

  useEffect(() => {
    const fetchESGData = async () => {
      try {
        const response = await axiosInstance.get('/esg-data');
        setESGData(response.data);
        setLoading(false);
      } catch (error) {
        setApiError(error.message);
      }
    };

    fetchESGData();
  }, []);

  const esgScoring = useMemo(() => (
    <ESGScoring key="esg-scoring" data={esgData || { esgScore: 0, carbonFootprint: 0 }} />
  ), [esgData]);

  return (
    <div>
      {message}
      {apiError && <div className="error" role="alert" aria-live="assertive" aria-atomic="true">
        <span className="visually-hidden">Error:</span> {apiError}
      </div>}
      {loading && <div>Loading ESG data...</div>}
      {esgScoring}
      <button onClick={handleOffsetPurchase}>Purchase Carbon Offsets</button>
    </div>
  );
};

// ... rest of the code remains the same

This updated code addresses the requested improvements and should provide a more resilient, accessible, and maintainable solution for your SaaS business.