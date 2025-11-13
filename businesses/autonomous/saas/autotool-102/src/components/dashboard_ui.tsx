// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { fetchDashboardData } from '../api/dashboardService'; // Placeholder for API call
import { useErrorBoundary } from 'react-error-boundary'; // Error boundary hook

interface DashboardData {
  activeUsers: number;
  monthlyRevenue: number;
  churnRate: number;
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err);
        setLoading(false);
        showBoundary(err); // Show error boundary
      }
    };

    loadDashboardData();
  }, [showBoundary]);

  const handleLogout = () => {
    // Implement logout logic here (e.g., clearing tokens, redirecting)
    console.log("Logging out...");
    navigate('/login'); // Redirect to login page
  };

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error loading dashboard. Please try again later.</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main className="dashboard-content">
        <section className="data-section">
          <h2>Key Metrics</h2>
          <div className="metric-card">
            <h3>Active Users</h3>
            <p>{dashboardData?.activeUsers || 'N/A'}</p>
          </div>
          <div className="metric-card">
            <h3>Monthly Revenue</h3>
            <p>${dashboardData?.monthlyRevenue || 'N/A'}</p>
          </div>
          <div className="metric-card">
            <h3>Churn Rate</h3>
            <p>{dashboardData?.churnRate || 'N/A'}%</p>
          </div>
        </section>

        <section className="user-management-section">
          <h2>User Management</h2>
          {/* Placeholder for user management features */}
          <p>Manage user accounts, roles, and permissions here.</p>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2025 Your SaaS Company</p>
      </footer>
    </div>
  );
};

export default DashboardUI;

// Placeholder for fetchDashboardData function (implement in api/dashboardService.ts)
// async function fetchDashboardData(): Promise<DashboardData> {
//   // Replace with actual API call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         activeUsers: 1234,
//         monthlyRevenue: 56789,
//         churnRate: 2.5,
//       });
//     }, 500);
//   });
// }