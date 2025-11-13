// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';

interface DashboardProps {
  userName: string;
}

const DashboardUI: React.FC<DashboardProps> = ({ userName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<{ users: number; activeUsers: number }>({ users: 0, activeUsers: 0 });

  useEffect(() => {
    // Simulate data fetching with error handling
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        setUserStats({ users: 1234, activeUsers: 567 });
        setLoading(false);
      } catch (e: any) {
        setError(e.message || "Failed to fetch user stats");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>
        <div className="dashboard-content">
          <div className="error-boundary">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>
        <div className="dashboard-content">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {userName}!</h1>
        <nav className="dashboard-nav">
          <ul>
            <li><a href="#">Overview</a></li>
            <li><a href="#">Users</a></li>
            <li><a href="#">Settings</a></li>
          </ul>
        </nav>
      </header>
      <div className="dashboard-content">
        <section className="dashboard-section">
          <h2>User Statistics</h2>
          <p>Total Users: {userStats.users}</p>
          <p>Active Users: {userStats.activeUsers}</p>
        </section>
        <section className="dashboard-section">
          <h2>Recent Activity</h2>
          <ul>
            <li>User A logged in</li>
            <li>User B updated profile</li>
          </ul>
        </section>
        <section className="dashboard-section">
          <h2>Key Metrics</h2>
          <p>Conversion Rate: 5%</p>
          <p>Customer Acquisition Cost: $10</p>
        </section>
      </div>
    </div>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';

interface DashboardProps {
  userName: string;
}

const DashboardUI: React.FC<DashboardProps> = ({ userName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<{ users: number; activeUsers: number }>({ users: 0, activeUsers: 0 });

  useEffect(() => {
    // Simulate data fetching with error handling
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        setUserStats({ users: 1234, activeUsers: 567 });
        setLoading(false);
      } catch (e: any) {
        setError(e.message || "Failed to fetch user stats");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>
        <div className="dashboard-content">
          <div className="error-boundary">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>
        <div className="dashboard-content">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome, {userName}!</h1>
        <nav className="dashboard-nav">
          <ul>
            <li><a href="#">Overview</a></li>
            <li><a href="#">Users</a></li>
            <li><a href="#">Settings</a></li>
          </ul>
        </nav>
      </header>
      <div className="dashboard-content">
        <section className="dashboard-section">
          <h2>User Statistics</h2>
          <p>Total Users: {userStats.users}</p>
          <p>Active Users: {userStats.activeUsers}</p>
        </section>
        <section className="dashboard-section">
          <h2>Recent Activity</h2>
          <ul>
            <li>User A logged in</li>
            <li>User B updated profile</li>
          </ul>
        </section>
        <section className="dashboard-section">
          <h2>Key Metrics</h2>
          <p>Conversion Rate: 5%</p>
          <p>Customer Acquisition Cost: $10</p>
        </section>
      </div>
    </div>
  );
};

export default DashboardUI;