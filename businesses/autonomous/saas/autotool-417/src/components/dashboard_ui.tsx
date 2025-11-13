// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardApi'; // Assuming an API endpoint exists
import ErrorBoundary from './ErrorBoundary'; // Assuming an ErrorBoundary component exists

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  // Add more data fields as needed
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="data-section">
          <h2>Users</h2>
          <p>Total Users: {dashboardData.users}</p>
          <p>Active Users: {dashboardData.activeUsers}</p>
        </div>
        <div className="data-section">
          <h2>Revenue</h2>
          <p>Total Revenue: ${dashboardData.revenue}</p>
        </div>
        {/* Add more sections and data displays as needed */}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// Dummy API call for demonstration purposes. Replace with actual API call.
async function fetchDashboardData(): Promise<DashboardData> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a successful API call
      resolve({
        users: 1000,
        activeUsers: 750,
        revenue: 50000,
      });

      // Simulate an error (uncomment to test error handling)
      // reject(new Error("Failed to fetch data"));
    }, 500);
  });
}