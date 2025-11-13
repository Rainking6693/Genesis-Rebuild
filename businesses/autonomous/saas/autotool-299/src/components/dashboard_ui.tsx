// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assume this fetches dashboard data
import ErrorBoundary from './ErrorBoundary'; // Error boundary component
import LoadingSpinner from './LoadingSpinner'; // Loading indicator

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
  // Add more data fields as needed
}

const DashboardUI: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchData();
        setData(dashboardData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-message">
        Error: {error}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="data-section">
          <div className="data-item">
            <h2>Total Users</h2>
            <p>{data?.users || 0}</p>
          </div>
          <div className="data-item">
            <h2>Active Users</h2>
            <p>{data?.activeUsers || 0}</p>
          </div>
          <div className="data-item">
            <h2>Revenue</h2>
            <p>${data?.revenue || 0}</p>
          </div>
          <div className="data-item">
            <h2>Churn Rate</h2>
            <p>{data?.churnRate || 0}%</p>
          </div>
          {/* Add more data items and visualizations here */}
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
    console.error("Caught error: ", error, errorInfo);
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

// src/components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner">
      Loading...
    </div>
  );
};

export default LoadingSpinner;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assume this fetches dashboard data
import ErrorBoundary from './ErrorBoundary'; // Error boundary component
import LoadingSpinner from './LoadingSpinner'; // Loading indicator

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
  // Add more data fields as needed
}

const DashboardUI: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchData();
        setData(dashboardData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-message">
        Error: {error}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="data-section">
          <div className="data-item">
            <h2>Total Users</h2>
            <p>{data?.users || 0}</p>
          </div>
          <div className="data-item">
            <h2>Active Users</h2>
            <p>{data?.activeUsers || 0}</p>
          </div>
          <div className="data-item">
            <h2>Revenue</h2>
            <p>${data?.revenue || 0}</p>
          </div>
          <div className="data-item">
            <h2>Churn Rate</h2>
            <p>{data?.churnRate || 0}%</p>
          </div>
          {/* Add more data items and visualizations here */}
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
    console.error("Caught error: ", error, errorInfo);
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

// src/components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner">
      Loading...
    </div>
  );
};

export default LoadingSpinner;