import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface EcoFlowAnalyticsProps {
  title: string;
  content: string;
  carbonFootprint: number;
  energyCost: number;
  wasteReduction: number;
}

interface EcoFlowAnalyticsResponse {
  data: EcoFlowAnalyticsProps;
  message?: string;
}

const EcoFlowAnalytics: React.FC = () => {
  const [data, setData] = useState<EcoFlowAnalyticsProps>({
    title: '',
    content: '',
    carbonFootprint: 0,
    energyCost: 0,
    wasteReduction: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<EcoFlowAnalyticsResponse> = await axios.get('/api/ecoflow-analytics');
      setData(response.data.data);
      setError(response.data.message || null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An error occurred while fetching EcoFlow Analytics data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading...</span>
        </div>
      ) : error ? (
        <div role="alert" aria-live="assertive">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <h1>{data.title || 'No title available'}</h1>
          <p>{data.content || 'No content available'}</p>
          <p>Carbon Footprint: {data.carbonFootprint.toFixed(2)}</p>
          <p>Energy Cost: {data.energyCost.toFixed(2)}</p>
          <p>Waste Reduction: {data.wasteReduction.toFixed(2)}</p>
        </>
      )}
    </div>
  );
};

export default EcoFlowAnalytics;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface EcoFlowAnalyticsProps {
  title: string;
  content: string;
  carbonFootprint: number;
  energyCost: number;
  wasteReduction: number;
}

interface EcoFlowAnalyticsResponse {
  data: EcoFlowAnalyticsProps;
  message?: string;
}

const EcoFlowAnalytics: React.FC = () => {
  const [data, setData] = useState<EcoFlowAnalyticsProps>({
    title: '',
    content: '',
    carbonFootprint: 0,
    energyCost: 0,
    wasteReduction: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<EcoFlowAnalyticsResponse> = await axios.get('/api/ecoflow-analytics');
      setData(response.data.data);
      setError(response.data.message || null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An error occurred while fetching EcoFlow Analytics data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      {isLoading ? (
        <div role="status" aria-live="polite">
          <span className="sr-only">Loading...</span>
        </div>
      ) : error ? (
        <div role="alert" aria-live="assertive">
          <p>{error}</p>
        </div>
      ) : (
        <>
          <h1>{data.title || 'No title available'}</h1>
          <p>{data.content || 'No content available'}</p>
          <p>Carbon Footprint: {data.carbonFootprint.toFixed(2)}</p>
          <p>Energy Cost: {data.energyCost.toFixed(2)}</p>
          <p>Waste Reduction: {data.wasteReduction.toFixed(2)}</p>
        </>
      )}
    </div>
  );
};

export default EcoFlowAnalytics;