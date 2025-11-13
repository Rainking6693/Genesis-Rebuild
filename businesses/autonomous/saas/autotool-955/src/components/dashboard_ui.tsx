// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';

interface DashboardData {
  userCount: number;
  recentActivity: string[];
  systemStatus: string;
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        setLoading(true);
        const response = await new Promise<DashboardData>((resolve, reject) => {
          setTimeout(() => {
            const success = Math.random() > 0.1; // Simulate occasional failure
            if (success) {
              resolve({
                userCount: 1234,
                recentActivity: ['User A logged in', 'User B updated profile'],
                systemStatus: 'Operational',
              });
            } else {
              reject(new Error('Failed to fetch dashboard data'));
            }
          }, 1000);
        });

        setDashboardData(response);
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
    return (
      <div>
        Error loading dashboard: {error}
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No data available.</div>; // Should never happen, but good to have.
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="user-count">
        User Count: {dashboardData.userCount}
      </div>
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <ul>
          {dashboardData.recentActivity.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>
      <div className="system-status">
        System Status: {dashboardData.systemStatus}
      </div>
    </div>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';

interface DashboardData {
  userCount: number;
  recentActivity: string[];
  systemStatus: string;
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        setLoading(true);
        const response = await new Promise<DashboardData>((resolve, reject) => {
          setTimeout(() => {
            const success = Math.random() > 0.1; // Simulate occasional failure
            if (success) {
              resolve({
                userCount: 1234,
                recentActivity: ['User A logged in', 'User B updated profile'],
                systemStatus: 'Operational',
              });
            } else {
              reject(new Error('Failed to fetch dashboard data'));
            }
          }, 1000);
        });

        setDashboardData(response);
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
    return (
      <div>
        Error loading dashboard: {error}
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No data available.</div>; // Should never happen, but good to have.
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="user-count">
        User Count: {dashboardData.userCount}
      </div>
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <ul>
          {dashboardData.recentActivity.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
      </div>
      <div className="system-status">
        System Status: {dashboardData.systemStatus}
      </div>
    </div>
  );
};

export default DashboardUI;