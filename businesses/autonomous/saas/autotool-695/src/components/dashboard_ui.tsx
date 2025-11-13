// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service exists
import ErrorBoundary from './ErrorBoundary'; // Assuming an ErrorBoundary component exists
import LoadingSpinner from './LoadingSpinner'; // Assuming a LoadingSpinner component exists

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

const DashboardUI: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await fetchData<DashboardData>('/api/dashboard'); // Replace with actual API endpoint
        setData(dashboardData);
      } catch (err: any) {
        setError(err);
        console.error("Error fetching dashboard data:", err); // Log the error for debugging
      } finally {
        setLoading(false);
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
        <div>Error: {error.message}</div>
      </ErrorBoundary>
    );
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        <p>Total Users: {data.users}</p>
        <p>Active Users: {data.activeUsers}</p>
        <p>Revenue: ${data.revenue}</p>
        <p>Churn Rate: {data.churnRate}%</p>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;