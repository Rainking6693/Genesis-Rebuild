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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with actual API endpoint
        setDashboardData(data);
      } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
        console.error("Error fetching dashboard data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div>Error loading dashboard data: {error.message}</div>
      </ErrorBoundary>
    );
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
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
            <p>${dashboardData.revenue.toFixed(2)}</p>
          </div>
          <div className="metric">
            <h2>Churn Rate</h2>
            <p>{dashboardData.churnRate}%</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with actual API endpoint
        setDashboardData(data);
      } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
        console.error("Error fetching dashboard data:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div>Error loading dashboard data: {error.message}</div>
      </ErrorBoundary>
    );
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
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
            <p>${dashboardData.revenue.toFixed(2)}</p>
          </div>
          <div className="metric">
            <h2>Churn Rate</h2>
            <p>{dashboardData.churnRate}%</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

**Explanation:**

*   **TypeScript:** The component is written in TypeScript for type safety.
*   **Error Handling:** Includes error handling using `try...catch` blocks and an `ErrorBoundary` component.  The `ErrorBoundary` is a crucial pattern for preventing crashes in React applications.
*   **Loading State:**  Uses a `LoadingSpinner` component to provide visual feedback while data is being fetched.
*   **Data Fetching:**  Uses a placeholder `fetchData` function (assumed to be in `../utils/api`) to fetch dashboard data from an API endpoint.  This function should handle network errors and return properly typed data.
*   **Type Safety:**  Defines a `DashboardData` interface to ensure type safety for the dashboard data.
*   **Conditional Rendering:**  Handles loading, error, and no-data states gracefully.
*   **Clear Structure:**  The code is well-structured and easy to read.
*   **Assumptions:** Assumes the existence of `ErrorBoundary`, `LoadingSpinner` components and a `fetchData` utility function. These would need to be implemented separately.  The API endpoint `/api/dashboard` is also a placeholder.

**Build Report:**

**Output:**