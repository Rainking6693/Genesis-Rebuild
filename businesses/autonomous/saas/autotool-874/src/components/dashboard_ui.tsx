// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../utils/api'; // Placeholder for API calls
import ErrorBoundary from './ErrorBoundary'; // Error boundary component

interface DashboardData {
  users: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with actual API endpoint
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        Error: {error}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="data-cards">
          <div className="card">
            <h2>Users</h2>
            <p>{dashboardData.users}</p>
          </div>
          <div className="card">
            <h2>Active Subscriptions</h2>
            <p>{dashboardData.activeSubscriptions}</p>
          </div>
          <div className="card">
            <h2>Monthly Revenue</h2>
            <p>${dashboardData.monthlyRevenue}</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/ErrorBoundary.tsx
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
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <p>Error: {this.state.error?.message}</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.errorInfo?.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../utils/api'; // Placeholder for API calls
import ErrorBoundary from './ErrorBoundary'; // Error boundary component

interface DashboardData {
  users: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with actual API endpoint
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        Error: {error}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="data-cards">
          <div className="card">
            <h2>Users</h2>
            <p>{dashboardData.users}</p>
          </div>
          <div className="card">
            <h2>Active Subscriptions</h2>
            <p>{dashboardData.activeSubscriptions}</p>
          </div>
          <div className="card">
            <h2>Monthly Revenue</h2>
            <p>${dashboardData.monthlyRevenue}</p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/ErrorBoundary.tsx
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
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <p>Error: {this.state.error?.message}</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.errorInfo?.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

**Build Report:**