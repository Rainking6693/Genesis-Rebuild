// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { useAuth } from '../contexts/AuthContext'; // Assuming an AuthContext exists

interface DashboardData {
  activeUsers: number;
  monthlyRevenue: number;
  churnRate: number;
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, logout } = useAuth(); // Use AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate fetching dashboard data from an API
        const response = await fetch('/api/dashboard'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login page after logout
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
    }
  };

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome to your Dashboard, {currentUser?.email || 'User'}!</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section className="dashboard-metrics">
        <div className="metric-card">
          <h2>Active Users</h2>
          <p>{dashboardData.activeUsers}</p>
        </div>
        <div className="metric-card">
          <h2>Monthly Revenue</h2>
          <p>${dashboardData.monthlyRevenue}</p>
        </div>
        <div className="metric-card">
          <h2>Churn Rate</h2>
          <p>{dashboardData.churnRate}%</p>
        </div>
      </section>

      <footer className="dashboard-footer">
        <p>&copy; 2025 Your SaaS Company</p>
      </footer>
    </div>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { useAuth } from '../contexts/AuthContext'; // Assuming an AuthContext exists

interface DashboardData {
  activeUsers: number;
  monthlyRevenue: number;
  churnRate: number;
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, logout } = useAuth(); // Use AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate fetching dashboard data from an API
        const response = await fetch('/api/dashboard'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login page after logout
    } catch (err: any) {
      setError(err.message || 'Failed to logout');
    }
  };

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome to your Dashboard, {currentUser?.email || 'User'}!</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <section className="dashboard-metrics">
        <div className="metric-card">
          <h2>Active Users</h2>
          <p>{dashboardData.activeUsers}</p>
        </div>
        <div className="metric-card">
          <h2>Monthly Revenue</h2>
          <p>${dashboardData.monthlyRevenue}</p>
        </div>
        <div className="metric-card">
          <h2>Churn Rate</h2>
          <p>{dashboardData.churnRate}%</p>
        </div>
      </section>

      <footer className="dashboard-footer">
        <p>&copy; 2025 Your SaaS Company</p>
      </footer>
    </div>
  );
};

export default DashboardUI;