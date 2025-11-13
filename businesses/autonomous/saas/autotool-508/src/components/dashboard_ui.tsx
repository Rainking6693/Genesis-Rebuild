// src/components/DashboardUI.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router for navigation
import { fetchDashboardData } from '../api/dashboardService'; // Placeholder for API call
import ErrorBoundary from './ErrorBoundary'; // Custom error boundary component
import LoadingSpinner from './LoadingSpinner'; // Custom loading spinner component
import { DashboardData } from '../types/dashboard'; // Type definition for dashboard data

interface DashboardProps {
  // Define any props the dashboard component might receive
}

const DashboardUI: React.FC<DashboardProps> = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDashboardData();
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

  const handleLogout = () => {
    // Implement logout logic (e.g., clearing tokens, redirecting to login)
    localStorage.removeItem('authToken'); // Example: Remove auth token
    navigate('/login'); // Redirect to login page
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading dashboard: {error.message}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div>
        No dashboard data available.
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <nav className="mb-4">
          <button onClick={handleLogout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </nav>

        {/* Display dashboard data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h2 className="text-lg font-semibold">Users</h2>
            <p>{dashboardData.userCount}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Active Subscriptions</h2>
            <p>{dashboardData.activeSubscriptions}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Revenue</h2>
            <p>${dashboardData.revenue}</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router for navigation
import { fetchDashboardData } from '../api/dashboardService'; // Placeholder for API call
import ErrorBoundary from './ErrorBoundary'; // Custom error boundary component
import LoadingSpinner from './LoadingSpinner'; // Custom loading spinner component
import { DashboardData } from '../types/dashboard'; // Type definition for dashboard data

interface DashboardProps {
  // Define any props the dashboard component might receive
}

const DashboardUI: React.FC<DashboardProps> = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDashboardData();
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

  const handleLogout = () => {
    // Implement logout logic (e.g., clearing tokens, redirecting to login)
    localStorage.removeItem('authToken'); // Example: Remove auth token
    navigate('/login'); // Redirect to login page
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading dashboard: {error.message}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div>
        No dashboard data available.
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <nav className="mb-4">
          <button onClick={handleLogout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </nav>

        {/* Display dashboard data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h2 className="text-lg font-semibold">Users</h2>
            <p>{dashboardData.userCount}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Active Subscriptions</h2>
            <p>{dashboardData.activeSubscriptions}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Revenue</h2>
            <p>${dashboardData.revenue}</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;