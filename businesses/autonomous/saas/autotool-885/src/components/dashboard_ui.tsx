// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../utils/api'; // Assuming an API utility
import ErrorBoundary from '../components/ErrorBoundary'; // Error boundary component
import LoadingSpinner from '../components/LoadingSpinner'; // Loading spinner component

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with actual API endpoint
        setDashboardData(data);
      } catch (err: any) { // Explicitly type 'err' as 'any' to avoid TypeScript errors
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
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
        <ErrorBoundary message={error} />
      </div>
    );
  }

  if (!dashboardData) {
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
          <p>{dashboardData.users}</p>
        </div>
        <div className="metric">
          <h2>Active Users</h2>
          <p>{dashboardData.activeUsers}</p>
        </div>
        <div className="metric">
          <h2>Revenue</h2>
          <p>${dashboardData.revenue}</p>
        </div>
        <div className="metric">
          <h2>Churn Rate</h2>
          <p>{dashboardData.churnRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../utils/api'; // Assuming an API utility
import ErrorBoundary from '../components/ErrorBoundary'; // Error boundary component
import LoadingSpinner from '../components/LoadingSpinner'; // Loading spinner component

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with actual API endpoint
        setDashboardData(data);
      } catch (err: any) { // Explicitly type 'err' as 'any' to avoid TypeScript errors
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
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
        <ErrorBoundary message={error} />
      </div>
    );
  }

  if (!dashboardData) {
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
          <p>{dashboardData.users}</p>
        </div>
        <div className="metric">
          <h2>Active Users</h2>
          <p>{dashboardData.activeUsers}</p>
        </div>
        <div className="metric">
          <h2>Revenue</h2>
          <p>${dashboardData.revenue}</p>
        </div>
        <div className="metric">
          <h2>Churn Rate</h2>
          <p>{dashboardData.churnRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;