import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface EcoTrackComponentProps {
  title: string;
  content: string;
  carbonFootprint: number;
  sustainabilityBadge: string;
}

interface OrderValue {
  orderValue: number;
}

const EcoTrackComponent: React.FC<EcoTrackComponentProps> = ({
  title,
  content,
  carbonFootprint,
  sustainabilityBadge,
}) => {
  const [orderValue, setOrderValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchOrderValue = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<OrderValue> = await axios.get('/api/order-value');
      setOrderValue(response.data.orderValue);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(
        axiosError.response?.data?.message || axiosError.message || 'An error occurred while fetching the order value.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrderValue();
  }, [fetchOrderValue]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <p>Carbon Footprint: {carbonFootprint} kg CO2e</p>
      <p>Sustainability Badge: {sustainabilityBadge}</p>
      {orderValue !== null ? (
        <p>Average Order Value: ${orderValue.toFixed(2)}</p>
      ) : error ? (
        <p aria-live="polite" role="alert">
          {error}
        </p>
      ) : isLoading ? (
        <p aria-live="polite" role="status">
          Loading order value...
        </p>
      ) : (
        <p aria-live="polite" role="alert">
          Failed to fetch order value. Please try again later.
        </p>
      )}
      <button onClick={fetchOrderValue} disabled={isLoading}>
        Refresh Order Value
      </button>
    </div>
  );
};

export default EcoTrackComponent;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface EcoTrackComponentProps {
  title: string;
  content: string;
  carbonFootprint: number;
  sustainabilityBadge: string;
}

interface OrderValue {
  orderValue: number;
}

const EcoTrackComponent: React.FC<EcoTrackComponentProps> = ({
  title,
  content,
  carbonFootprint,
  sustainabilityBadge,
}) => {
  const [orderValue, setOrderValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchOrderValue = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<OrderValue> = await axios.get('/api/order-value');
      setOrderValue(response.data.orderValue);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError;
      setError(
        axiosError.response?.data?.message || axiosError.message || 'An error occurred while fetching the order value.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrderValue();
  }, [fetchOrderValue]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <p>Carbon Footprint: {carbonFootprint} kg CO2e</p>
      <p>Sustainability Badge: {sustainabilityBadge}</p>
      {orderValue !== null ? (
        <p>Average Order Value: ${orderValue.toFixed(2)}</p>
      ) : error ? (
        <p aria-live="polite" role="alert">
          {error}
        </p>
      ) : isLoading ? (
        <p aria-live="polite" role="status">
          Loading order value...
        </p>
      ) : (
        <p aria-live="polite" role="alert">
          Failed to fetch order value. Please try again later.
        </p>
      )}
      <button onClick={fetchOrderValue} disabled={isLoading}>
        Refresh Order Value
      </button>
    </div>
  );
};

export default EcoTrackComponent;