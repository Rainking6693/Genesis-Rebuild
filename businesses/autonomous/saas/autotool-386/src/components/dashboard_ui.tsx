// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { fetchData } from '../utils/api'; // Assuming an API utility function
import { LoadingSpinner } from './LoadingSpinner'; // Assuming a loading spinner component
import { ErrorBoundary } from './ErrorBoundary'; // Assuming an error boundary component

interface DashboardData {
  users: number;
  activeSubscriptions: number;
  revenue: number;
  // Add more data types as needed
}

interface Props {
  // Define any props the component needs
}

interface State {
  data: DashboardData | null;
  loading: boolean;
  error: Error | null;
}

class DashboardUI extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchDashboardData();
  }

  async fetchDashboardData() {
    try {
      const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with actual API endpoint
      this.setState({ data, loading: false, error: null });
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      this.setState({ error, loading: false });
    }
  }

  render() {
    const { data, loading, error } = this.state;

    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className="error-message">
          Error: {error.message}
          {/* Consider adding a retry button or more informative error message */}
        </div>
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
            <h2>Users</h2>
            <p>{data.users}</p>
          </div>
          <div className="metric">
            <h2>Active Subscriptions</h2>
            <p>{data.activeSubscriptions}</p>
          </div>
          <div className="metric">
            <h2>Revenue</h2>
            <p>${data.revenue}</p>
          </div>
          {/* Add more metrics as needed */}
        </div>
      </div>
    );
  }
}

export default DashboardUI;

// Example ErrorBoundary component (can be moved to a separate file)
class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { fetchData } from '../utils/api'; // Assuming an API utility function
import { LoadingSpinner } from './LoadingSpinner'; // Assuming a loading spinner component
import { ErrorBoundary } from './ErrorBoundary'; // Assuming an error boundary component

interface DashboardData {
  users: number;
  activeSubscriptions: number;
  revenue: number;
  // Add more data types as needed
}

interface Props {
  // Define any props the component needs
}

interface State {
  data: DashboardData | null;
  loading: boolean;
  error: Error | null;
}

class DashboardUI extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      data: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchDashboardData();
  }

  async fetchDashboardData() {
    try {
      const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with actual API endpoint
      this.setState({ data, loading: false, error: null });
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      this.setState({ error, loading: false });
    }
  }

  render() {
    const { data, loading, error } = this.state;

    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <div className="error-message">
          Error: {error.message}
          {/* Consider adding a retry button or more informative error message */}
        </div>
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
            <h2>Users</h2>
            <p>{data.users}</p>
          </div>
          <div className="metric">
            <h2>Active Subscriptions</h2>
            <p>{data.activeSubscriptions}</p>
          </div>
          <div className="metric">
            <h2>Revenue</h2>
            <p>${data.revenue}</p>
          </div>
          {/* Add more metrics as needed */}
        </div>
      </div>
    );
  }
}

export default DashboardUI;

// Example ErrorBoundary component (can be moved to a separate file)
class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}