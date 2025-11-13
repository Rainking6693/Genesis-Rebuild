// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {dashboardData.users}</p>
      <p>Active Users: {dashboardData.activeUsers}</p>
      <p>Revenue: ${dashboardData.revenue}</p>
    </div>
  );
};

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

const DashboardUIWrapper: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("Caught an error in ErrorBoundary", error, info);
        // Log the error to an error reporting service
      }}
    >
      <DashboardUI />
    </ErrorBoundary>
  );
};

export default DashboardUIWrapper;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {dashboardData.users}</p>
      <p>Active Users: {dashboardData.activeUsers}</p>
      <p>Revenue: ${dashboardData.revenue}</p>
    </div>
  );
};

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
};

const DashboardUIWrapper: React.FC = () => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        console.error("Caught an error in ErrorBoundary", error, info);
        // Log the error to an error reporting service
      }}
    >
      <DashboardUI />
    </ErrorBoundary>
  );
};

export default DashboardUIWrapper;

Now, I will write the code to a file.