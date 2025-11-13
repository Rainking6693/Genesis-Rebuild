// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext'; // Assuming an AuthContext exists
import { fetchData } from '../api/dataService'; // Assuming a data service exists
import { Chart } from 'react-chartjs-2'; // Example data visualization library
import { ErrorBoundary } from 'react-error-boundary'; // Error boundary component

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  // ... other data points
}

const DashboardUI = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const data = await fetchData<DashboardData>('/dashboard', user.token); // Fetch data with user token
          setDashboardData(data);
        } else {
          setError("User not authenticated.");
        }
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (authLoading) {
    return <div>Loading authentication...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
        {/* Implement retry mechanism here */}
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>;
  }

  // Example Chart Data
  const chartData = {
    labels: ['Users', 'Active Users', 'Revenue'],
    datasets: [
      {
        label: 'Dashboard Metrics',
        data: [dashboardData.users, dashboardData.activeUsers, dashboardData.revenue],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <ErrorBoundary fallback={<div>Something went wrong with the dashboard.</div>}>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome, {user?.email}!</p>

        {/* Display data */}
        <p>Total Users: {dashboardData.users}</p>
        <p>Active Users: {dashboardData.activeUsers}</p>
        <p>Revenue: ${dashboardData.revenue}</p>

        {/* Example Chart */}
        <div style={{ width: '400px' }}>
          <Chart type='bar' data={chartData} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext'; // Assuming an AuthContext exists
import { fetchData } from '../api/dataService'; // Assuming a data service exists
import { Chart } from 'react-chartjs-2'; // Example data visualization library
import { ErrorBoundary } from 'react-error-boundary'; // Error boundary component

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  // ... other data points
}

const DashboardUI = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const data = await fetchData<DashboardData>('/dashboard', user.token); // Fetch data with user token
          setDashboardData(data);
        } else {
          setError("User not authenticated.");
        }
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (authLoading) {
    return <div>Loading authentication...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
        {/* Implement retry mechanism here */}
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>;
  }

  // Example Chart Data
  const chartData = {
    labels: ['Users', 'Active Users', 'Revenue'],
    datasets: [
      {
        label: 'Dashboard Metrics',
        data: [dashboardData.users, dashboardData.activeUsers, dashboardData.revenue],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <ErrorBoundary fallback={<div>Something went wrong with the dashboard.</div>}>
      <div>
        <h1>Dashboard</h1>
        <p>Welcome, {user?.email}!</p>

        {/* Display data */}
        <p>Total Users: {dashboardData.users}</p>
        <p>Active Users: {dashboardData.activeUsers}</p>
        <p>Revenue: ${dashboardData.revenue}</p>

        {/* Example Chart */}
        <div style={{ width: '400px' }}>
          <Chart type='bar' data={chartData} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;