// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service exists
import { ErrorBoundary } from 'react-error-boundary'; // For robust error handling

interface DashboardData {
  userCount: number;
  activeUsers: number;
  revenue: number;
  // Add more data fields as needed
}

interface Props {
  children?: ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function DashboardUI({ children }: Props) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with actual API endpoint
        setDashboardData(data);
      } catch (err: any) {
        setError(err);
        console.error("Error fetching dashboard data:", err); // Log the error for debugging
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error: Error, info: ErrorInfo) => {
          console.error("ErrorBoundary caught an error:", error, info);
        }}
      >
        <div>Error: {error.message}</div>
      </ErrorBoundary>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>User Count: {dashboardData?.userCount}</p>
      <p>Active Users: {dashboardData?.activeUsers}</p>
      <p>Revenue: ${dashboardData?.revenue}</p>
      {children}
    </div>
  );
}

export default DashboardUI;