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
        const dashboardData = await fetchData<DashboardData>('/dashboard');
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
    return (
      <div className="dashboard">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <ErrorBoundary error={error} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard">
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="metrics">
        <div className="metric">
          <h2>Total Users</h2>
          <p>{data.users}</p>
        </div>
        <div className="metric">
          <h2>Active Users</h2>
          <p>{data.activeUsers}</p>
        </div>
        <div className="metric">
          <h2>Revenue</h2>
          <p>${data.revenue}</p>
        </div>
        <div className="metric">
          <h2>Churn Rate</h2>
          <p>{data.churnRate}%</p>
        </div>
      </div>
    </div>
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
        const dashboardData = await fetchData<DashboardData>('/dashboard');
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
    return (
      <div className="dashboard">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <ErrorBoundary error={error} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard">
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="metrics">
        <div className="metric">
          <h2>Total Users</h2>
          <p>{data.users}</p>
        </div>
        <div className="metric">
          <h2>Active Users</h2>
          <p>{data.activeUsers}</p>
        </div>
        <div className="metric">
          <h2>Revenue</h2>
          <p>${data.revenue}</p>
        </div>
        <div className="metric">
          <h2>Churn Rate</h2>
          <p>{data.churnRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;