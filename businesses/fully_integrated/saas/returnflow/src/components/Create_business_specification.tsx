import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface Return {
  orderId: string;
  item: string;
  reason: string;
  status: string;
}

interface ReturnFlowProps {
  title: string;
  description: string;
}

const ReturnFlow: React.FC<ReturnFlowProps> = ({ title, description }) => {
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReturns = useCallback(async () => {
    try {
      const response: AxiosResponse<Return[]> = await axios.get('/api/returns');
      setReturns(response.data);
      setLoading(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Error fetching returns data'
      );
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  return (
    <div className="return-flow" aria-live="polite">
      <h1 className="return-flow__title">{title}</h1>
      <p className="return-flow__description">{description}</p>
      {loading ? (
        <div className="return-flow__loading" aria-live="assertive">
          Loading...
        </div>
      ) : error ? (
        <div className="return-flow__error" aria-live="assertive">
          Error: {error}
        </div>
      ) : (
        <div className="return-flow__content">
          <h2 className="return-flow__returns-title">Returns</h2>
          <ul className="return-flow__returns-list" aria-live="polite">
            {returns.map((r, i) => (
              <li
                key={i}
                className="return-flow__returns-item"
                aria-label={`Order ID: ${r.orderId}, Item: ${r.item}, Reason: ${r.reason}, Status: ${r.status}`}
              >
                <strong className="return-flow__returns-label">Order ID:</strong>{' '}
                {r.orderId}
                <br />
                <strong className="return-flow__returns-label">Item:</strong>{' '}
                {r.item}
                <br />
                <strong className="return-flow__returns-label">Reason:</strong>{' '}
                {r.reason}
                <br />
                <strong className="return-flow__returns-label">Status:</strong>{' '}
                {r.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReturnFlow;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface Return {
  orderId: string;
  item: string;
  reason: string;
  status: string;
}

interface ReturnFlowProps {
  title: string;
  description: string;
}

const ReturnFlow: React.FC<ReturnFlowProps> = ({ title, description }) => {
  const [returns, setReturns] = useState<Return[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReturns = useCallback(async () => {
    try {
      const response: AxiosResponse<Return[]> = await axios.get('/api/returns');
      setReturns(response.data);
      setLoading(false);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'Error fetching returns data'
      );
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  return (
    <div className="return-flow" aria-live="polite">
      <h1 className="return-flow__title">{title}</h1>
      <p className="return-flow__description">{description}</p>
      {loading ? (
        <div className="return-flow__loading" aria-live="assertive">
          Loading...
        </div>
      ) : error ? (
        <div className="return-flow__error" aria-live="assertive">
          Error: {error}
        </div>
      ) : (
        <div className="return-flow__content">
          <h2 className="return-flow__returns-title">Returns</h2>
          <ul className="return-flow__returns-list" aria-live="polite">
            {returns.map((r, i) => (
              <li
                key={i}
                className="return-flow__returns-item"
                aria-label={`Order ID: ${r.orderId}, Item: ${r.item}, Reason: ${r.reason}, Status: ${r.status}`}
              >
                <strong className="return-flow__returns-label">Order ID:</strong>{' '}
                {r.orderId}
                <br />
                <strong className="return-flow__returns-label">Item:</strong>{' '}
                {r.item}
                <br />
                <strong className="return-flow__returns-label">Reason:</strong>{' '}
                {r.reason}
                <br />
                <strong className="return-flow__returns-label">Status:</strong>{' '}
                {r.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReturnFlow;