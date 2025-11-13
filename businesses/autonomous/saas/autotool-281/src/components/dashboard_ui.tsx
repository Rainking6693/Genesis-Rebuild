// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';

interface DashboardData {
  activeUsers: number;
  totalRevenue: number;
  newSignups: number;
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockData: DashboardData = {
            activeUsers: 125,
            totalRevenue: 5000,
            newSignups: 15,
          };
          setDashboardData(mockData);
          setLoading(false);
        }, 1000); // Simulate network latency
      } catch (e: any) {
        setError(e.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
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
    <div>
      <h1>Dashboard</h1>
      <p>Active Users: {dashboardData.activeUsers}</p>
      <p>Total Revenue: ${dashboardData.totalRevenue}</p>
      <p>New Signups: {dashboardData.newSignups}</p>
    </div>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';

interface DashboardData {
  activeUsers: number;
  totalRevenue: number;
  newSignups: number;
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        setTimeout(() => {
          const mockData: DashboardData = {
            activeUsers: 125,
            totalRevenue: 5000,
            newSignups: 15,
          };
          setDashboardData(mockData);
          setLoading(false);
        }, 1000); // Simulate network latency
      } catch (e: any) {
        setError(e.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
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
    <div>
      <h1>Dashboard</h1>
      <p>Active Users: {dashboardData.activeUsers}</p>
      <p>Total Revenue: ${dashboardData.totalRevenue}</p>
      <p>New Signups: {dashboardData.newSignups}</p>
    </div>
  );
};

export default DashboardUI;