// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../utils/api'; // Assuming an API utility
import ErrorBoundary from './ErrorBoundary'; // Assuming an ErrorBoundary component
import LoadingSpinner from './LoadingSpinner'; // Assuming a LoadingSpinner component

interface DashboardData {
  users: number;
  activeSubscriptions: number;
  revenue: number;
  churnRate: number;
}

const DashboardUI: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchData<DashboardData>('/api/dashboard'); // Replace with your actual API endpoint
        setData(dashboardData);
        setLoading(false);
      } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
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
        <p className="error">Error: {error}</p>
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
    <ErrorBoundary>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="metrics">
          <div className="metric">
            <h2>Users</h2>
            <p>{data.users}</p>
          </div>
          <div className="metric">
            <h2>Active Subscriptions</h2>
            <p>{data.activeSubscriptions}</p>
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
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../utils/api'; // Assuming an API utility
import ErrorBoundary from './ErrorBoundary'; // Assuming an ErrorBoundary component
import LoadingSpinner from './LoadingSpinner'; // Assuming a LoadingSpinner component

interface DashboardData {
  users: number;
  activeSubscriptions: number;
  revenue: number;
  churnRate: number;
}

const DashboardUI: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchData<DashboardData>('/api/dashboard'); // Replace with your actual API endpoint
        setData(dashboardData);
        setLoading(false);
      } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
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
        <p className="error">Error: {error}</p>
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
    <ErrorBoundary>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="metrics">
          <div className="metric">
            <h2>Users</h2>
            <p>{data.users}</p>
          </div>
          <div className="metric">
            <h2>Active Subscriptions</h2>
            <p>{data.activeSubscriptions}</p>
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
    </ErrorBoundary>
  );
};

export default DashboardUI;