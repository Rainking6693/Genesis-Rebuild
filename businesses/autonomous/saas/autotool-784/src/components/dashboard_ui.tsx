// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate fetching data from an API
        const response = await new Promise<DashboardData>((resolve, reject) => {
          setTimeout(() => {
            const success = Math.random() > 0.1; // Simulate occasional failure
            if (success) {
              resolve({
                users: 1234,
                activeUsers: 876,
                revenue: 56789,
                churnRate: 0.05,
              });
            } else {
              reject(new Error("Failed to fetch dashboard data"));
            }
          }, 1000);
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
    return <div>Error: {error.message}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <section>
        <h2>User Metrics</h2>
        <p>Total Users: {dashboardData.users}</p>
        <p>Active Users: {dashboardData.activeUsers}</p>
      </section>
      <section>
        <h2>Financial Metrics</h2>
        <p>Revenue: ${dashboardData.revenue}</p>
        <p>Churn Rate: {dashboardData.churnRate * 100}%</p>
      </section>
    </div>
  );
};

const ErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre style={{ color: 'red' }}>{error.message}</pre>
    <button onClick={reset}>Try again</button>
  </div>
);

const DashboardUIWithErrorBoundary = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => {
      console.error("ErrorBoundary caught an error:", error, info);
      // You can also log the error to an error tracking service here
    }}
  >
    <DashboardUI />
  </ErrorBoundary>
);

export default DashboardUIWithErrorBoundary;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate fetching data from an API
        const response = await new Promise<DashboardData>((resolve, reject) => {
          setTimeout(() => {
            const success = Math.random() > 0.1; // Simulate occasional failure
            if (success) {
              resolve({
                users: 1234,
                activeUsers: 876,
                revenue: 56789,
                churnRate: 0.05,
              });
            } else {
              reject(new Error("Failed to fetch dashboard data"));
            }
          }, 1000);
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
    return <div>Error: {error.message}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <section>
        <h2>User Metrics</h2>
        <p>Total Users: {dashboardData.users}</p>
        <p>Active Users: {dashboardData.activeUsers}</p>
      </section>
      <section>
        <h2>Financial Metrics</h2>
        <p>Revenue: ${dashboardData.revenue}</p>
        <p>Churn Rate: {dashboardData.churnRate * 100}%</p>
      </section>
    </div>
  );
};

const ErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre style={{ color: 'red' }}>{error.message}</pre>
    <button onClick={reset}>Try again</button>
  </div>
);

const DashboardUIWithErrorBoundary = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => {
      console.error("ErrorBoundary caught an error:", error, info);
      // You can also log the error to an error tracking service here
    }}
  >
    <DashboardUI />
  </ErrorBoundary>
);

export default DashboardUIWithErrorBoundary;

Now, I will use the tools to write the code and output the build report.