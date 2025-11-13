// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used for navigation

interface DashboardData {
  activeUsers: number;
  monthlyRevenue: number;
  churnRate: number;
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call to fetch dashboard data
        const response = await fetch('/api/dashboard'); // Replace with actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
      } catch (e: any) {
        console.error("Error fetching dashboard data:", e);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // Simulate logout functionality
    localStorage.removeItem('authToken'); // Remove token
    navigate('/login'); // Redirect to login page
  };

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>; // Handle case where data is still null after loading
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <div className="metrics-container">
        <div className="metric">
          <h2>Active Users</h2>
          <p>{dashboardData.activeUsers}</p>
        </div>
        <div className="metric">
          <h2>Monthly Revenue</h2>
          <p>${dashboardData.monthlyRevenue}</p>
        </div>
        <div className="metric">
          <h2>Churn Rate</h2>
          <p>{dashboardData.churnRate}%</p>
        </div>
      </div>

      {/* Add more dashboard components and features here */}
    </div>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used for navigation

interface DashboardData {
  activeUsers: number;
  monthlyRevenue: number;
  churnRate: number;
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call to fetch dashboard data
        const response = await fetch('/api/dashboard'); // Replace with actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
      } catch (e: any) {
        console.error("Error fetching dashboard data:", e);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    // Simulate logout functionality
    localStorage.removeItem('authToken'); // Remove token
    navigate('/login'); // Redirect to login page
  };

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No dashboard data available.</div>; // Handle case where data is still null after loading
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <div className="metrics-container">
        <div className="metric">
          <h2>Active Users</h2>
          <p>{dashboardData.activeUsers}</p>
        </div>
        <div className="metric">
          <h2>Monthly Revenue</h2>
          <p>${dashboardData.monthlyRevenue}</p>
        </div>
        <div className="metric">
          <h2>Churn Rate</h2>
          <p>{dashboardData.churnRate}%</p>
        </div>
      </div>

      {/* Add more dashboard components and features here */}
    </div>
  );
};

export default DashboardUI;