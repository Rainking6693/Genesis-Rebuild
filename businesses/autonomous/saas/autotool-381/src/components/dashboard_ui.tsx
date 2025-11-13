// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardApi'; // Placeholder API call
import ErrorBoundary from './ErrorBoundary'; // Error boundary component

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  // Add more data types as needed
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message || 'Failed to load dashboard data.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div>Error: {error}</div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        {dashboardData && (
          <>
            <p>Total Users: {dashboardData.users}</p>
            <p>Active Users: {dashboardData.activeUsers}</p>
            <p>Revenue: ${dashboardData.revenue}</p>
            {/* Add more dashboard components here (charts, tables, etc.) */}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// Placeholder API call (replace with actual API call)
async function fetchDashboardData(): Promise<DashboardData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.2; // Simulate occasional failure
      if (success) {
        resolve({
          users: 1234,
          activeUsers: 567,
          revenue: 89012,
        });
      } else {
        reject(new Error("Failed to fetch data from the API."));
      }
    }, 500);
  });
}

// Placeholder ErrorBoundary component (replace with actual implementation)
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const errorHandler = (error: any, info: any) => {
      console.error("Caught an error: ", error, info);
      setHasError(true);
    };

    window.addEventListener("error", errorHandler);

    return () => {
      window.removeEventListener("error", errorHandler);
    };
  }, []);

  if (hasError) {
    return (
      <div>
        <h2>Something went wrong.</h2>
        <details style={{ whiteSpace: 'pre-wrap' }}>
          {/* You can add error details here for debugging purposes */}
        </details>
      </div>
    );
  }

  return children;
}