// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary'; // Assuming you have an ErrorBoundary component

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  // Add more data types as needed
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        setLoading(true);
        const response = await fetch('/api/dashboard'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
      } catch (e: any) {
        console.error("Error fetching dashboard data:", e);
        setError(e.message || "An error occurred while fetching data.");
      } finally {
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
      <ErrorBoundary>
        <div>Error: {error}</div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        {dashboardData && (
          <>
            <p>Total Users: {dashboardData.users}</p>
            <p>Active Users: {dashboardData.activeUsers}</p>
            <p>Revenue: ${dashboardData.revenue}</p>
            {/* Add more dashboard components here (charts, tables, etc.) */}
          </>
        )}
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
    console.error("Caught an error:", error, errorInfo);
    this.setState({error: error, errorInfo: errorInfo})
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

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary'; // Assuming you have an ErrorBoundary component

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  // Add more data types as needed
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        setLoading(true);
        const response = await fetch('/api/dashboard'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
      } catch (e: any) {
        console.error("Error fetching dashboard data:", e);
        setError(e.message || "An error occurred while fetching data.");
      } finally {
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
      <ErrorBoundary>
        <div>Error: {error}</div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        {dashboardData && (
          <>
            <p>Total Users: {dashboardData.users}</p>
            <p>Active Users: {dashboardData.activeUsers}</p>
            <p>Revenue: ${dashboardData.revenue}</p>
            {/* Add more dashboard components here (charts, tables, etc.) */}
          </>
        )}
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
    console.error("Caught an error:", error, errorInfo);
    this.setState({error: error, errorInfo: errorInfo})
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