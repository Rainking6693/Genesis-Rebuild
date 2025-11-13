// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router for navigation

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  // Add more data types as needed
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        setLoading(true);
        const response = await new Promise<DashboardData>((resolve) => {
          setTimeout(() => {
            resolve({
              users: 1200,
              activeUsers: 850,
              revenue: 50000,
            });
          }, 1000); // Simulate 1 second API delay
        });

        setDashboardData(response);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // Implement logout logic here (e.g., clear local storage, redirect to login)
    navigate('/login'); // Redirect to login page
  };

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <nav className="dashboard-nav">
        <ul>
          <li><a href="/dashboard">Overview</a></li>
          <li><a href="/users">Users</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>
      </nav>

      <main className="dashboard-content">
        <section className="dashboard-section">
          <h2>Statistics</h2>
          {dashboardData && (
            <>
              <p>Total Users: {dashboardData.users}</p>
              <p>Active Users: {dashboardData.activeUsers}</p>
              <p>Revenue: ${dashboardData.revenue}</p>
            </>
          )}
        </section>

        <section className="dashboard-section">
          <h2>Recent Activity</h2>
          {/* Add recent activity feed here */}
          <p>No recent activity to display.</p>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 Your SaaS Company</p>
      </footer>
    </div>
  );
};

export default DashboardUI;