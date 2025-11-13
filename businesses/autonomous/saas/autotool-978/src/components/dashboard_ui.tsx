// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  userCount: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error loading dashboard data: {error}
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>;
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong with the dashboard.</div>}>
      <div>
        <h1>Dashboard</h1>
        <p>User Count: {dashboardData.userCount}</p>
        <p>Active Users: {dashboardData.activeUsers}</p>
        <p>Revenue: ${dashboardData.revenue}</p>
        <p>Churn Rate: {dashboardData.churnRate}%</p>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  userCount: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error loading dashboard data: {error}
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>;
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong with the dashboard.</div>}>
      <div>
        <h1>Dashboard</h1>
        <p>User Count: {dashboardData.userCount}</p>
        <p>Active Users: {dashboardData.activeUsers}</p>
        <p>Revenue: ${dashboardData.revenue}</p>
        <p>Churn Rate: {dashboardData.churnRate}%</p>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;