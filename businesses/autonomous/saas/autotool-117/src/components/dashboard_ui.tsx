// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSpinner } from './LoadingSpinner';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchData<DashboardData>('/dashboard');
        setData(dashboardData);
        setLoading(false);
      } catch (e: any) {
        setError(e as Error);
        setLoading(false);
        console.error("Error fetching dashboard data:", e);
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

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-metrics">
        <div className="metric">
          <h2>Total Users</h2>
          <p>{data.users}</p>
        </div>
        <div className="metric">
          <h2>Active Users</h2>
          <p>{data.activeUsers}</p>
        </div>
        <div className="metric">
          <h2>Revenue</h2>
          <p>${data.revenue}</p>
        </div>
        <div className="metric">
          <h2>Churn Rate</h2>
          <p>{data.churnRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// src/api/dataService.ts
export async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching data:", error);
    throw new Error(`Failed to fetch data from ${endpoint}: ${error.message}`);
  }
}

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

export class ErrorBoundary extends React.Component<Props, State> {
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
    console.error("Caught error:", error, errorInfo);
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

// src/components/LoadingSpinner.tsx
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};

// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSpinner } from './LoadingSpinner';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchData<DashboardData>('/dashboard');
        setData(dashboardData);
        setLoading(false);
      } catch (e: any) {
        setError(e as Error);
        setLoading(false);
        console.error("Error fetching dashboard data:", e);
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

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-metrics">
        <div className="metric">
          <h2>Total Users</h2>
          <p>{data.users}</p>
        </div>
        <div className="metric">
          <h2>Active Users</h2>
          <p>{data.activeUsers}</p>
        </div>
        <div className="metric">
          <h2>Revenue</h2>
          <p>${data.revenue}</p>
        </div>
        <div className="metric">
          <h2>Churn Rate</h2>
          <p>{data.churnRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// src/api/dataService.ts
export async function fetchData<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: T = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching data:", error);
    throw new Error(`Failed to fetch data from ${endpoint}: ${error.message}`);
  }
}

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

export class ErrorBoundary extends React.Component<Props, State> {
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
    console.error("Caught error:", error, errorInfo);
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

// src/components/LoadingSpinner.tsx
import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
};