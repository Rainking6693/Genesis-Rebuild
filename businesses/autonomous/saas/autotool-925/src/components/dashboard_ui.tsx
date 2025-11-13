// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboard'; // Assume an API endpoint exists
import ErrorBoundary from './ErrorBoundary'; // Reusable error boundary component
import LoadingSpinner from './LoadingSpinner'; // Reusable loading spinner component

interface DashboardData {
  activeUsers: number;
  totalRevenue: number;
  newSignups: number;
  // Add more data types as needed
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data.');
        setLoading(false);
      }
    };

    fetchData();
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
        <ErrorBoundary message={error} />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="metrics">
        <div className="metric-card">
          <h2>Active Users</h2>
          <p>{dashboardData?.activeUsers || 0}</p>
        </div>
        <div className="metric-card">
          <h2>Total Revenue</h2>
          <p>${dashboardData?.totalRevenue || 0}</p>
        </div>
        <div className="metric-card">
          <h2>New Signups</h2>
          <p>{dashboardData?.newSignups || 0}</p>
        </div>
      </div>
      {/* Add more components for charts, tables, etc. */}
    </div>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboard'; // Assume an API endpoint exists
import ErrorBoundary from './ErrorBoundary'; // Reusable error boundary component
import LoadingSpinner from './LoadingSpinner'; // Reusable loading spinner component

interface DashboardData {
  activeUsers: number;
  totalRevenue: number;
  newSignups: number;
  // Add more data types as needed
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data.');
        setLoading(false);
      }
    };

    fetchData();
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
        <ErrorBoundary message={error} />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="metrics">
        <div className="metric-card">
          <h2>Active Users</h2>
          <p>{dashboardData?.activeUsers || 0}</p>
        </div>
        <div className="metric-card">
          <h2>Total Revenue</h2>
          <p>${dashboardData?.totalRevenue || 0}</p>
        </div>
        <div className="metric-card">
          <h2>New Signups</h2>
          <p>{dashboardData?.newSignups || 0}</p>
        </div>
      </div>
      {/* Add more components for charts, tables, etc. */}
    </div>
  );
};

export default DashboardUI;