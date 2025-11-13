// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

const DashboardUI: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        const response = await fetch('/api/dashboard-data'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData: DashboardData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
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

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        {/* Navigation links */}
        <a href="#">Overview</a>
        <a href="#">Users</a>
        <a href="#">Settings</a>
      </nav>

      <main className="dashboard-content">
        <h1>Dashboard</h1>
        <div className="data-grid">
          <div className="data-item">
            <h2>Total Users</h2>
            <p>{data.users}</p>
          </div>
          <div className="data-item">
            <h2>Active Users</h2>
            <p>{data.activeUsers}</p>
          </div>
          <div className="data-item">
            <h2>Revenue</h2>
            <p>${data.revenue}</p>
          </div>
          <div className="data-item">
            <h2>Churn Rate</h2>
            <p>{data.churnRate}%</p>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        {/* Footer information */}
        <p>&copy; 2025 Your SaaS Company</p>
      </footer>
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
  churnRate: number;
}

const DashboardUI: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        const response = await fetch('/api/dashboard-data'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData: DashboardData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
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

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        {/* Navigation links */}
        <a href="#">Overview</a>
        <a href="#">Users</a>
        <a href="#">Settings</a>
      </nav>

      <main className="dashboard-content">
        <h1>Dashboard</h1>
        <div className="data-grid">
          <div className="data-item">
            <h2>Total Users</h2>
            <p>{data.users}</p>
          </div>
          <div className="data-item">
            <h2>Active Users</h2>
            <p>{data.activeUsers}</p>
          </div>
          <div className="data-item">
            <h2>Revenue</h2>
            <p>${data.revenue}</p>
          </div>
          <div className="data-item">
            <h2>Churn Rate</h2>
            <p>{data.churnRate}%</p>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        {/* Footer information */}
        <p>&copy; 2025 Your SaaS Company</p>
      </footer>
    </div>
  );
};

export default DashboardUI;