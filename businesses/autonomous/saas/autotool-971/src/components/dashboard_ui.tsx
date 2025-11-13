// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboard'; // Assume an API endpoint exists
import { ErrorBoundary } from './ErrorBoundary'; // Assume an ErrorBoundary component exists
import { LoadingSpinner } from './LoadingSpinner'; // Assume a LoadingSpinner component exists

interface DashboardData {
  activeUsers: number;
  totalRevenue: number;
  recentActivity: { timestamp: string; action: string; user: string }[];
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
        console.error("Error fetching dashboard data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <p>Error loading dashboard data: {error.message}</p>
      </ErrorBoundary>
    );
  }

  if (!dashboardData) {
    return <p>No data available.</p>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="metrics">
        <div className="metric">
          <h2>Active Users</h2>
          <p>{dashboardData.activeUsers}</p>
        </div>
        <div className="metric">
          <h2>Total Revenue</h2>
          <p>${dashboardData.totalRevenue}</p>
        </div>
      </div>
      <div className="activity">
        <h2>Recent Activity</h2>
        <ul>
          {dashboardData.recentActivity.map((activity, index) => (
            <li key={index}>
              {activity.timestamp} - {activity.user} - {activity.action}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboard'; // Assume an API endpoint exists
import { ErrorBoundary } from './ErrorBoundary'; // Assume an ErrorBoundary component exists
import { LoadingSpinner } from './LoadingSpinner'; // Assume a LoadingSpinner component exists

interface DashboardData {
  activeUsers: number;
  totalRevenue: number;
  recentActivity: { timestamp: string; action: string; user: string }[];
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
        console.error("Error fetching dashboard data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <p>Error loading dashboard data: {error.message}</p>
      </ErrorBoundary>
    );
  }

  if (!dashboardData) {
    return <p>No data available.</p>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="metrics">
        <div className="metric">
          <h2>Active Users</h2>
          <p>{dashboardData.activeUsers}</p>
        </div>
        <div className="metric">
          <h2>Total Revenue</h2>
          <p>${dashboardData.totalRevenue}</p>
        </div>
      </div>
      <div className="activity">
        <h2>Recent Activity</h2>
        <ul>
          {dashboardData.recentActivity.map((activity, index) => (
            <li key={index}>
              {activity.timestamp} - {activity.user} - {activity.action}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardUI;