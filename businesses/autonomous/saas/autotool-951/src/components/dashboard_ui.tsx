// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';

interface DashboardData {
  userCount: number;
  activeUsers: number;
  revenue: number;
  [key: string]: any; // Allow for future expansion
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        const response = await fetch('/api/dashboardData'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
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

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        {/* Navigation links */}
        <ul>
          <li><a href="#">Overview</a></li>
          <li><a href="#">Users</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </nav>

      <main className="dashboard-content">
        <h1>Dashboard</h1>
        <div className="data-display">
          <div className="data-item">
            <h2>Total Users</h2>
            <p>{dashboardData.userCount}</p>
          </div>
          <div className="data-item">
            <h2>Active Users</h2>
            <p>{dashboardData.activeUsers}</p>
          </div>
          <div className="data-item">
            <h2>Revenue</h2>
            <p>${dashboardData.revenue}</p>
          </div>
          {/* Add more data items as needed */}
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 Your SaaS Company</p>
      </footer>
    </div>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';

interface DashboardData {
  userCount: number;
  activeUsers: number;
  revenue: number;
  [key: string]: any; // Allow for future expansion
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        const response = await fetch('/api/dashboardData'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
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

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        {/* Navigation links */}
        <ul>
          <li><a href="#">Overview</a></li>
          <li><a href="#">Users</a></li>
          <li><a href="#">Settings</a></li>
        </ul>
      </nav>

      <main className="dashboard-content">
        <h1>Dashboard</h1>
        <div className="data-display">
          <div className="data-item">
            <h2>Total Users</h2>
            <p>{dashboardData.userCount}</p>
          </div>
          <div className="data-item">
            <h2>Active Users</h2>
            <p>{dashboardData.activeUsers}</p>
          </div>
          <div className="data-item">
            <h2>Revenue</h2>
            <p>${dashboardData.revenue}</p>
          </div>
          {/* Add more data items as needed */}
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 Your SaaS Company</p>
      </footer>
    </div>
  );
};

export default DashboardUI;