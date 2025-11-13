// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        setLoading(true);
        const response = await new Promise<DashboardData>((resolve) => {
          setTimeout(() => {
            resolve({
              users: 1234,
              activeUsers: 567,
              revenue: 123456,
              chartData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'Monthly Revenue',
                    data: [65, 59, 80, 81, 56, 55],
                    backgroundColor: 'rgba(75,192,192,0.2)',
                  },
                ],
              },
            });
          }, 1000); // Simulate API delay
        });

        setDashboardData(response);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error loading dashboard: {error.message}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>; // Handle the case where data is still null after loading
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {dashboardData.users}</p>
      <p>Active Users: {dashboardData.activeUsers}</p>
      <p>Revenue: ${dashboardData.revenue}</p>

      {/* Placeholder for chart */}
      <div>
        <h2>Monthly Revenue</h2>
        {/* Replace with actual chart component */}
        <p>Chart data will be displayed here.</p>
      </div>

      {/* Placeholder for table */}
      <div>
        <h2>User Activity</h2>
        {/* Replace with actual table component */}
        <p>Table data will be displayed here.</p>
      </div>
    </div>
  );
};

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

const WrappedDashboardUI = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => {
      console.error("Error caught by error boundary:", error, info);
      // You can also log the error to an error reporting service here
    }}
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
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        setLoading(true);
        const response = await new Promise<DashboardData>((resolve) => {
          setTimeout(() => {
            resolve({
              users: 1234,
              activeUsers: 567,
              revenue: 123456,
              chartData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'Monthly Revenue',
                    data: [65, 59, 80, 81, 56, 55],
                    backgroundColor: 'rgba(75,192,192,0.2)',
                  },
                ],
              },
            });
          }, 1000); // Simulate API delay
        });

        setDashboardData(response);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error loading dashboard: {error.message}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>; // Handle the case where data is still null after loading
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {dashboardData.users}</p>
      <p>Active Users: {dashboardData.activeUsers}</p>
      <p>Revenue: ${dashboardData.revenue}</p>

      {/* Placeholder for chart */}
      <div>
        <h2>Monthly Revenue</h2>
        {/* Replace with actual chart component */}
        <p>Chart data will be displayed here.</p>
      </div>

      {/* Placeholder for table */}
      <div>
        <h2>User Activity</h2>
        {/* Replace with actual table component */}
        <p>Table data will be displayed here.</p>
      </div>
    </div>
  );
};

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

const WrappedDashboardUI = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => {
      console.error("Error caught by error boundary:", error, info);
      // You can also log the error to an error reporting service here
    }}
  >
    <DashboardUI />
  </ErrorBoundary>
);

export default WrappedDashboardUI;