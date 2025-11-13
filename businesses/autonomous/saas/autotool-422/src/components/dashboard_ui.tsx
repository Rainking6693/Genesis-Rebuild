// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  activeUsers: number;
  totalRevenue: number;
  systemStatus: string;
  recentActivity: string[];
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
                activeUsers: 1234,
                totalRevenue: 56789,
                systemStatus: 'Operational',
                recentActivity: ['User A logged in', 'User B updated profile', 'System backup completed'],
              });
            } else {
              reject(new Error('Failed to fetch dashboard data'));
            }
          }, 1000); // Simulate network latency
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
    return <div>Error: {error.message}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <section>
        <h2>Key Metrics</h2>
        <p>Active Users: {dashboardData.activeUsers}</p>
        <p>Total Revenue: ${dashboardData.totalRevenue}</p>
      </section>
      <section>
        <h2>System Status</h2>
        <p>Status: {dashboardData.systemStatus}</p>
      </section>
      <section>
        <h2>Recent Activity</h2>
        <ul>
          {dashboardData.recentActivity.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

const ErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{color: 'red'}}>{error.message}</pre>
      <button onClick={reset}>Try again</button>
    </div>
  );
};

const SafeDashboardUI = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => {
      console.error("ErrorBoundary caught an error:", error, info);
    }}
  >
    <DashboardUI />
  </ErrorBoundary>
);

export default SafeDashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  activeUsers: number;
  totalRevenue: number;
  systemStatus: string;
  recentActivity: string[];
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
                activeUsers: 1234,
                totalRevenue: 56789,
                systemStatus: 'Operational',
                recentActivity: ['User A logged in', 'User B updated profile', 'System backup completed'],
              });
            } else {
              reject(new Error('Failed to fetch dashboard data'));
            }
          }, 1000); // Simulate network latency
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
    return <div>Error: {error.message}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <section>
        <h2>Key Metrics</h2>
        <p>Active Users: {dashboardData.activeUsers}</p>
        <p>Total Revenue: ${dashboardData.totalRevenue}</p>
      </section>
      <section>
        <h2>System Status</h2>
        <p>Status: {dashboardData.systemStatus}</p>
      </section>
      <section>
        <h2>Recent Activity</h2>
        <ul>
          {dashboardData.recentActivity.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

const ErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{color: 'red'}}>{error.message}</pre>
      <button onClick={reset}>Try again</button>
    </div>
  );
};

const SafeDashboardUI = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => {
      console.error("ErrorBoundary caught an error:", error, info);
    }}
  >
    <DashboardUI />
  </ErrorBoundary>
);

export default SafeDashboardUI;