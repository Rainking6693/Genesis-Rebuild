// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext'; // Assuming an AuthContext exists
import { fetchDashboardData } from '../api/dashboardApi'; // Assuming an API endpoint exists
import { Chart } from 'react-chartjs-2'; // Assuming react-chartjs-2 is used for charts
import { ErrorBoundary } from 'react-error-boundary'; // For error boundaries

interface DashboardData {
  activeUsers: number;
  monthlyRevenue: number;
  churnRate: number;
  // Add more data types as needed
}

const DashboardUI: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        setError(err);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      loadDashboardData();
    }
  }, [isLoggedIn]);

  const ErrorFallback = ({ error }: { error: Error }) => (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );

  if (!isLoggedIn) {
    return <div>Please log in to view the dashboard.</div>;
  }

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[error]}>
        <div>Error loading dashboard. Please try again later.</div>
      </ErrorBoundary>
    );
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>;
  }

  // Example Chart Data
  const chartData = {
    labels: ['Active Users', 'Monthly Revenue', 'Churn Rate'],
    datasets: [
      {
        label: 'Key Metrics',
        data: [dashboardData.activeUsers, dashboardData.monthlyRevenue, dashboardData.churnRate],
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
    <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[dashboardData]}>
      <div>
        <h1>Welcome, {user?.name || 'User'}!</h1>
        <h2>Dashboard</h2>

        <div style={{ width: '400px' }}>
          <Chart type="bar" data={chartData} />
        </div>

        <p>Active Users: {dashboardData.activeUsers}</p>
        <p>Monthly Revenue: ${dashboardData.monthlyRevenue}</p>
        <p>Churn Rate: {dashboardData.churnRate}%</p>

        {/* Add more dashboard elements here */}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext'; // Assuming an AuthContext exists
import { fetchDashboardData } from '../api/dashboardApi'; // Assuming an API endpoint exists
import { Chart } from 'react-chartjs-2'; // Assuming react-chartjs-2 is used for charts
import { ErrorBoundary } from 'react-error-boundary'; // For error boundaries

interface DashboardData {
  activeUsers: number;
  monthlyRevenue: number;
  churnRate: number;
  // Add more data types as needed
}

const DashboardUI: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        setError(err);
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      loadDashboardData();
    }
  }, [isLoggedIn]);

  const ErrorFallback = ({ error }: { error: Error }) => (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );

  if (!isLoggedIn) {
    return <div>Please log in to view the dashboard.</div>;
  }

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[error]}>
        <div>Error loading dashboard. Please try again later.</div>
      </ErrorBoundary>
    );
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>;
  }

  // Example Chart Data
  const chartData = {
    labels: ['Active Users', 'Monthly Revenue', 'Churn Rate'],
    datasets: [
      {
        label: 'Key Metrics',
        data: [dashboardData.activeUsers, dashboardData.monthlyRevenue, dashboardData.churnRate],
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
    <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[dashboardData]}>
      <div>
        <h1>Welcome, {user?.name || 'User'}!</h1>
        <h2>Dashboard</h2>

        <div style={{ width: '400px' }}>
          <Chart type="bar" data={chartData} />
        </div>

        <p>Active Users: {dashboardData.activeUsers}</p>
        <p>Monthly Revenue: ${dashboardData.monthlyRevenue}</p>
        <p>Churn Rate: {dashboardData.churnRate}%</p>

        {/* Add more dashboard elements here */}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;