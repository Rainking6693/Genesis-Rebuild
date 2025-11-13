import React, { useState, useEffect, useCallback } from 'react';

interface CustomerSupportData {
  phone: string;
  email: string;
  hours: string;
}

interface MyComponentProps {
  title: string;
  description: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, description }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<CustomerSupportData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/customer-support-data');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      console.error('Error fetching customer support data:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchData({ signal: abortController.signal });
    return () => abortController.abort();
  }, [fetchData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>An error occurred while fetching customer support data:</p>
        <p>{error.message}</p>
        <button onClick={() => fetchData()}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <div>
        <h2>Customer Support Information</h2>
        <p>Phone: {data.phone || 'N/A'}</p>
        <p>Email: <a href={`mailto:${data.email || ''}`}>{data.email || 'N/A'}</a></p>
        <p>Hours: {data.hours || 'N/A'}</p>
      </div>
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useCallback } from 'react';

interface CustomerSupportData {
  phone: string;
  email: string;
  hours: string;
}

interface MyComponentProps {
  title: string;
  description: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, description }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<CustomerSupportData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/customer-support-data');
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      console.error('Error fetching customer support data:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchData({ signal: abortController.signal });
    return () => abortController.abort();
  }, [fetchData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h2>Error</h2>
        <p>An error occurred while fetching customer support data:</p>
        <p>{error.message}</p>
        <button onClick={() => fetchData()}>Retry</button>
      </div>
    );
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <div>
        <h2>Customer Support Information</h2>
        <p>Phone: {data.phone || 'N/A'}</p>
        <p>Email: <a href={`mailto:${data.email || ''}`}>{data.email || 'N/A'}</a></p>
        <p>Hours: {data.hours || 'N/A'}</p>
      </div>
    </div>
  );
};

export default MyComponent;