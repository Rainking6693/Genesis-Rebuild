// src/components/DashboardUI.tsx

import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardApi'; // Placeholder API call
import ErrorBoundary from './ErrorBoundary'; // Error boundary component
import LoadingSpinner from './LoadingSpinner'; // Loading indicator

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  // Add more data types as needed
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data.');
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <ErrorBoundary errorMessage={error} />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {dashboardData && (
        <>
          <div className="metric">
            <h2>Total Users:</h2>
            <p>{dashboardData.users}</p>
          </div>
          <div className="metric">
            <h2>Active Users:</h2>
            <p>{dashboardData.activeUsers}</p>
          </div>
          <div className="metric">
            <h2>Revenue:</h2>
            <p>${dashboardData.revenue}</p>
          </div>
          {/* Add more metrics and UI elements here */}
        </>
      )}
    </div>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx

import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardApi'; // Placeholder API call
import ErrorBoundary from './ErrorBoundary'; // Error boundary component
import LoadingSpinner from './LoadingSpinner'; // Loading indicator

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  // Add more data types as needed
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data.');
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <ErrorBoundary errorMessage={error} />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {dashboardData && (
        <>
          <div className="metric">
            <h2>Total Users:</h2>
            <p>{dashboardData.users}</p>
          </div>
          <div className="metric">
            <h2>Active Users:</h2>
            <p>{dashboardData.activeUsers}</p>
          </div>
          <div className="metric">
            <h2>Revenue:</h2>
            <p>${dashboardData.revenue}</p>
          </div>
          {/* Add more metrics and UI elements here */}
        </>
      )}
    </div>
  );
};

export default DashboardUI;