// src/components/DashboardUI.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { fetchData } from '../utils/api'; // Assuming an API utility
import ErrorBoundary from '../components/ErrorBoundary'; // Error Boundary Component
import LoadingSpinner from '../components/LoadingSpinner'; // Loading Spinner Component

interface DashboardData {
  users: number;
  activeSubscriptions: number;
  revenue: number;
  // Add more data types as needed
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData<DashboardData>('/api/dashboard'); // Example API endpoint
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
        setError(err);
        setLoading(false);
        console.error("Error fetching dashboard data:", err); // Log the error
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div>Error: {error.message}</div>
      </ErrorBoundary>
    );
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        <p>Users: {dashboardData.users}</p>
        <p>Active Subscriptions: {dashboardData.activeSubscriptions}</p>
        <p>Revenue: ${dashboardData.revenue}</p>
        {/* Add more UI elements to display the data */}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// utils/api.ts (Example API utility - needs to be implemented)
export async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as T;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error; // Re-throw for component-level handling
  }
}

// components/ErrorBoundary.tsx (Simple Error Boundary - needs to be implemented)
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// components/LoadingSpinner.tsx (Simple Loading Spinner - needs to be implemented)
import React from 'react';

const LoadingSpinner = () => {
  return <div>Loading...</div>;
};

export default LoadingSpinner;