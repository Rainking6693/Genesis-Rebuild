// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../utils/api'; // Assuming an API utility
import ErrorBoundary from './ErrorBoundary'; // Error boundary component
import LoadingSpinner from './LoadingSpinner'; // Loading spinner component

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with your actual API endpoint
        setDashboardData(data);
      } catch (err: any) { // Explicitly type 'err' as 'any' to avoid TypeScript errors
        setError(err);
        console.error("Error fetching dashboard data:", err); // Log the error for debugging
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <ErrorBoundary error={error}>
          <p>Error loading dashboard data. Please try again later.</p>
        </ErrorBoundary>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard">
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="metrics">
        <div className="metric">
          <h2>Total Users</h2>
          <p>{dashboardData.users}</p>
        </div>
        <div className="metric">
          <h2>Active Users</h2>
          <p>{dashboardData.activeUsers}</p>
        </div>
        <div className="metric">
          <h2>Revenue</h2>
          <p>${dashboardData.revenue}</p>
        </div>
        <div className="metric">
          <h2>Churn Rate</h2>
          <p>{dashboardData.churnRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../utils/api'; // Assuming an API utility
import ErrorBoundary from './ErrorBoundary'; // Error boundary component
import LoadingSpinner from './LoadingSpinner'; // Loading spinner component

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with your actual API endpoint
        setDashboardData(data);
      } catch (err: any) { // Explicitly type 'err' as 'any' to avoid TypeScript errors
        setError(err);
        console.error("Error fetching dashboard data:", err); // Log the error for debugging
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <ErrorBoundary error={error}>
          <p>Error loading dashboard data. Please try again later.</p>
        </ErrorBoundary>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard">
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="metrics">
        <div className="metric">
          <h2>Total Users</h2>
          <p>{dashboardData.users}</p>
        </div>
        <div className="metric">
          <h2>Active Users</h2>
          <p>{dashboardData.activeUsers}</p>
        </div>
        <div className="metric">
          <h2>Revenue</h2>
          <p>${dashboardData.revenue}</p>
        </div>
        <div className="metric">
          <h2>Churn Rate</h2>
          <p>{dashboardData.churnRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;

**Explanation:**

*   **TypeScript and React:** The component is written in TypeScript and uses React for building the UI.
*   **Data Fetching:**  It uses a placeholder `fetchData` function (assumed to be in `../utils/api`) to retrieve dashboard data from an API endpoint (`/api/dashboard`).  This should be replaced with your actual API call.
*   **Loading State:**  A `LoadingSpinner` component is displayed while the data is being fetched.
*   **Error Handling:** An `ErrorBoundary` component (assumed to be in `./ErrorBoundary`) is used to catch and display errors. The error is also logged to the console for debugging.  The `try...catch...finally` block ensures that the loading state is always updated.
*   **Type Safety:**  The `DashboardData` interface defines the expected structure of the dashboard data, ensuring type safety.
*   **Conditional Rendering:**  The component handles different states: loading, error, and data available.
*   **Basic UI:**  The UI displays basic metrics like total users, active users, revenue, and churn rate. This is a basic structure and can be expanded upon.

**Next Steps:**

1.  **Implement `fetchData`:** Replace the placeholder `fetchData` function with your actual API call.
2.  **Implement `ErrorBoundary` and `LoadingSpinner`:** Create the `ErrorBoundary` and `LoadingSpinner` components.
3.  **API Endpoint:** Ensure that the `/api/dashboard` endpoint returns data in the format defined by the `DashboardData` interface.
4.  **Styling:** Add CSS styling to improve the appearance of the dashboard.
5.  **Testing:** Write unit tests and integration tests to ensure the component functions correctly.