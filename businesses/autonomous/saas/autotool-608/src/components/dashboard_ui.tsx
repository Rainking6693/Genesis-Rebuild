// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardApi'; // Assuming an API endpoint exists
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  userCount: number;
  activeUsers: number;
  monthlyRevenue: number;
  kpiMetrics: { [key: string]: number };
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error loading dashboard: {error.message}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {dashboardData.userCount}</p>
      <p>Active Users: {dashboardData.activeUsers}</p>
      <p>Monthly Revenue: ${dashboardData.monthlyRevenue}</p>

      <h2>Key Performance Indicators</h2>
      <ul>
        {Object.entries(dashboardData.kpiMetrics).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={reset}>Try again</button>
    </div>
  );
};

const DashboardUIWithErrorBoundary = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => {
      console.error("ErrorBoundary caught an error", error, info);
      // You can also log the error to an error reporting service
    }}
  >
    <DashboardUI />
  </ErrorBoundary>
);

export default DashboardUIWithErrorBoundary;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardApi'; // Assuming an API endpoint exists
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  userCount: number;
  activeUsers: number;
  monthlyRevenue: number;
  kpiMetrics: { [key: string]: number };
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error loading dashboard: {error.message}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {dashboardData.userCount}</p>
      <p>Active Users: {dashboardData.activeUsers}</p>
      <p>Monthly Revenue: ${dashboardData.monthlyRevenue}</p>

      <h2>Key Performance Indicators</h2>
      <ul>
        {Object.entries(dashboardData.kpiMetrics).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

const ErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={reset}>Try again</button>
    </div>
  );
};

const DashboardUIWithErrorBoundary = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => {
      console.error("ErrorBoundary caught an error", error, info);
      // You can also log the error to an error reporting service
    }}
  >
    <DashboardUI />
  </ErrorBoundary>
);

export default DashboardUIWithErrorBoundary;