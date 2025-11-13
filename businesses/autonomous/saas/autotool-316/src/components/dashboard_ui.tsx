// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service
import ErrorBoundary from './ErrorBoundary'; // Error boundary component
import LoadingSpinner from './LoadingSpinner'; // Loading spinner component

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
        const dashboardData = await fetchData<DashboardData>('/api/dashboard');
        setData(dashboardData);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
        console.error("Error fetching dashboard data:", err); // Log the error
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
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="data-grid">
          <div className="data-item">
            <h2>Total Users</h2>
            <p>{data.users}</p>
          </div>
          <div className="data-item">
            <h2>Active Users</h2>
            <p>{data.activeUsers}</p>
          </div>
          <div className="data-item">
            <h2>Revenue</h2>
            <p>${data.revenue}</p>
          </div>
          <div className="data-item">
            <h2>Churn Rate</h2>
            <p>{data.churnRate}%</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service
import ErrorBoundary from './ErrorBoundary'; // Error boundary component
import LoadingSpinner from './LoadingSpinner'; // Loading spinner component

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
        const dashboardData = await fetchData<DashboardData>('/api/dashboard');
        setData(dashboardData);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
        console.error("Error fetching dashboard data:", err); // Log the error
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
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="data-grid">
          <div className="data-item">
            <h2>Total Users</h2>
            <p>{data.users}</p>
          </div>
          <div className="data-item">
            <h2>Active Users</h2>
            <p>{data.activeUsers}</p>
          </div>
          <div className="data-item">
            <h2>Revenue</h2>
            <p>${data.revenue}</p>
          </div>
          <div className="data-item">
            <h2>Churn Rate</h2>
            <p>{data.churnRate}%</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;