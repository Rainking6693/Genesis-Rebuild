// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  error?: string;
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    users: 0,
    activeUsers: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        setLoading(true);
        const response = await new Promise((resolve) =>
          setTimeout(() => {
            resolve({
              users: 1234,
              activeUsers: 567,
              revenue: 89012,
            });
          }, 1000)
        );

        setDashboardData(response as DashboardData);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData({
          users: 0,
          activeUsers: 0,
          revenue: 0,
          error: "Failed to load dashboard data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (dashboardData.error) {
    return <div>Error: {dashboardData.error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="data-container">
        <div className="data-item">
          <h2>Total Users</h2>
          <p>{dashboardData.users}</p>
        </div>
        <div className="data-item">
          <h2>Active Users</h2>
          <p>{dashboardData.activeUsers}</p>
        </div>
        <div className="data-item">
          <h2>Revenue</h2>
          <p>${dashboardData.revenue}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  error?: string;
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    users: 0,
    activeUsers: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        setLoading(true);
        const response = await new Promise((resolve) =>
          setTimeout(() => {
            resolve({
              users: 1234,
              activeUsers: 567,
              revenue: 89012,
            });
          }, 1000)
        );

        setDashboardData(response as DashboardData);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData({
          users: 0,
          activeUsers: 0,
          revenue: 0,
          error: "Failed to load dashboard data.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (dashboardData.error) {
    return <div>Error: {dashboardData.error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="data-container">
        <div className="data-item">
          <h2>Total Users</h2>
          <p>{dashboardData.users}</p>
        </div>
        <div className="data-item">
          <h2>Active Users</h2>
          <p>{dashboardData.activeUsers}</p>
        </div>
        <div className="data-item">
          <h2>Revenue</h2>
          <p>${dashboardData.revenue}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;