// src/components/DashboardUI.tsx

import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  // Add more data types as needed
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        const response = await new Promise<DashboardData>((resolve, reject) => {
          setTimeout(() => {
            // Simulate success or failure
            const success = Math.random() > 0.2; // 80% chance of success
            if (success) {
              resolve({
                users: 1234,
                activeUsers: 567,
                revenue: 89012,
              });
            } else {
              reject(new Error("Failed to fetch dashboard data."));
            }
          }, 1000); // Simulate network latency
        });

        setDashboardData(response);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error.message}
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {dashboardData?.users}</p>
      <p>Active Users: {dashboardData?.activeUsers}</p>
      <p>Revenue: ${dashboardData?.revenue}</p>
      {/* Add more dashboard elements here */}
    </div>
  );
};

const ErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre style={{color: 'red'}}>{error.message}</pre>
    <button onClick={reset}>Try again</button>
  </div>
);

const WrappedDashboardUI: React.FC = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => console.error("Error caught by error boundary:", error, info)}
  >
    <DashboardUI />
  </ErrorBoundary>
);

export default WrappedDashboardUI;

// src/components/DashboardUI.tsx

import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  // Add more data types as needed
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        const response = await new Promise<DashboardData>((resolve, reject) => {
          setTimeout(() => {
            // Simulate success or failure
            const success = Math.random() > 0.2; // 80% chance of success
            if (success) {
              resolve({
                users: 1234,
                activeUsers: 567,
                revenue: 89012,
              });
            } else {
              reject(new Error("Failed to fetch dashboard data."));
            }
          }, 1000); // Simulate network latency
        });

        setDashboardData(response);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error.message}
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {dashboardData?.users}</p>
      <p>Active Users: {dashboardData?.activeUsers}</p>
      <p>Revenue: ${dashboardData?.revenue}</p>
      {/* Add more dashboard elements here */}
    </div>
  );
};

const ErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre style={{color: 'red'}}>{error.message}</pre>
    <button onClick={reset}>Try again</button>
  </div>
);

const WrappedDashboardUI: React.FC = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => console.error("Error caught by error boundary:", error, info)}
  >
    <DashboardUI />
  </ErrorBoundary>
);

export default WrappedDashboardUI;