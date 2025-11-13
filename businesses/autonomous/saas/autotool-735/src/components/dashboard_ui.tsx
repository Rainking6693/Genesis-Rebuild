// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  chartData: {
    labels: string[];
    data: number[];
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
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                data: [10, 20, 15, 25, 30],
              },
            });
          }, 500); // Simulate network latency
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

  return (
    <ErrorBoundary fallback={<div>Something went wrong with the dashboard.</div>}>
      <div>
        <h1>Dashboard</h1>
        <p>Total Users: {dashboardData?.users}</p>
        <p>Active Users: {dashboardData?.activeUsers}</p>
        <p>Revenue: ${dashboardData?.revenue}</p>

        {/* Placeholder for Chart Component */}
        <div>
          <h2>Revenue Chart</h2>
          {/*  Chart component would go here, using dashboardData.chartData */}
          <p>Chart Placeholder</p>
        </div>

        {/* Placeholder for Table Component */}
        <div>
          <h2>User Activity</h2>
          {/* Table component would go here, displaying user activity data */}
          <p>Table Placeholder</p>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;