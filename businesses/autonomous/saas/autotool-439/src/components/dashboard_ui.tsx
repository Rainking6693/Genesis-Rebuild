// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardService'; // Assuming an API service exists
import { ErrorBoundary } from './ErrorBoundary'; // Assuming an ErrorBoundary component exists

interface DashboardData {
  activeUsers: number;
  monthlyRevenue: number;
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
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        <p>Active Users: {dashboardData.activeUsers}</p>
        <p>Monthly Revenue: ${dashboardData.monthlyRevenue}</p>
        <p>Churn Rate: {dashboardData.churnRate}%</p>
        {/* Add more UI elements and data displays here */}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardService'; // Assuming an API service exists
import { ErrorBoundary } from './ErrorBoundary'; // Assuming an ErrorBoundary component exists

interface DashboardData {
  activeUsers: number;
  monthlyRevenue: number;
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
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        <p>Active Users: {dashboardData.activeUsers}</p>
        <p>Monthly Revenue: ${dashboardData.monthlyRevenue}</p>
        <p>Churn Rate: {dashboardData.churnRate}%</p>
        {/* Add more UI elements and data displays here */}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;