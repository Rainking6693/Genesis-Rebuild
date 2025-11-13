// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  activeUsers: number;
  monthlyRevenue: number;
  churnRate: number;
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        setLoading(true);
        const response = await new Promise<DashboardData>((resolve, reject) => {
          setTimeout(() => {
            const success = Math.random() > 0.1; // Simulate occasional failure
            if (success) {
              resolve({
                activeUsers: 1234,
                monthlyRevenue: 56789,
                churnRate: 0.05,
              });
            } else {
              reject(new Error("Failed to fetch dashboard data"));
            }
          }, 1000); // Simulate API latency
        });

        setDashboardData(response);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
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
    return <div>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Active Users: {dashboardData.activeUsers}</p>
      <p>Monthly Revenue: ${dashboardData.monthlyRevenue}</p>
      <p>Churn Rate: {dashboardData.churnRate * 100}%</p>
    </div>
  );
};

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
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
    onError={(error, info) => console.error("Caught an error in ErrorBoundary", error, info)}
  >
    <DashboardUI />
  </ErrorBoundary>
);

export default WrappedDashboardUI;

**Action:**