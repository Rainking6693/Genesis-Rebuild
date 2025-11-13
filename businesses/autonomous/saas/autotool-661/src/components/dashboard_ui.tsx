// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service exists
import ErrorBoundary from './ErrorBoundary'; // Assuming an ErrorBoundary component exists

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

const DashboardUI = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchData<DashboardData>('/api/dashboard');
        setData(dashboardData);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
        console.error("Error fetching dashboard data:", err); // Log the error for debugging
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
        <div>Error: {error.message}</div>
      </ErrorBoundary>
    );
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Total Users: {data.users}</p>
      <p>Active Users: {data.activeUsers}</p>
      <p>Revenue: ${data.revenue}</p>
      <p>Churn Rate: {data.churnRate}%</p>
    </div>
  );
};

export default DashboardUI;