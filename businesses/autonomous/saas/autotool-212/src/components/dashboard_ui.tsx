// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service exists
import ErrorBoundary from './ErrorBoundary'; // Assuming an error boundary component exists
import LoadingSpinner from './LoadingSpinner'; // Assuming a loading spinner component exists

interface DashboardData {
  users: number;
  activeSubscriptions: number;
  revenue: number;
}

const DashboardUI: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData();
        setData(result);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
        console.error("Error fetching dashboard data:", err); // Logging the error
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div>
          Error: {error.message}
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        <p>Users: {data?.users}</p>
        <p>Active Subscriptions: {data?.activeSubscriptions}</p>
        <p>Revenue: ${data?.revenue}</p>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service exists
import ErrorBoundary from './ErrorBoundary'; // Assuming an error boundary component exists
import LoadingSpinner from './LoadingSpinner'; // Assuming a loading spinner component exists

interface DashboardData {
  users: number;
  activeSubscriptions: number;
  revenue: number;
}

const DashboardUI: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData();
        setData(result);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
        console.error("Error fetching dashboard data:", err); // Logging the error
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div>
          Error: {error.message}
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        <p>Users: {data?.users}</p>
        <p>Active Subscriptions: {data?.activeSubscriptions}</p>
        <p>Revenue: ${data?.revenue}</p>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;