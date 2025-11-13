// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service
import { LoadingSpinner } from './LoadingSpinner'; // Assuming a loading spinner component
import { ErrorBoundary } from './ErrorBoundary'; // Assuming an error boundary component

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

interface Props {
  // Define any props the component might receive
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
    this.loadData();
  }

  async loadData() {
    this.setState({ loading: true, error: null });
    try {
      const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with actual API endpoint
      this.setState({ data: data, loading: false });
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      this.setState({ error: error, loading: false });
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
          Error loading dashboard data: {error.message}
        </div>
      );
    }

    if (!data) {
      return <div>No data available.</div>;
    }

    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="metrics">
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
  }
}

export default DashboardUI;

// Example ErrorBoundary component (can be in a separate file)
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
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Example LoadingSpinner component (can be in a separate file)
const LoadingSpinner = () => {
  return <div>Loading...</div>;
};

// Example fetchData function (can be in a separate file)
async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to be caught by the component
  }
}

// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service
import { LoadingSpinner } from './LoadingSpinner'; // Assuming a loading spinner component
import { ErrorBoundary } from './ErrorBoundary'; // Assuming an error boundary component

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

interface Props {
  // Define any props the component might receive
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
    this.loadData();
  }

  async loadData() {
    this.setState({ loading: true, error: null });
    try {
      const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with actual API endpoint
      this.setState({ data: data, loading: false });
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      this.setState({ error: error, loading: false });
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
          Error loading dashboard data: {error.message}
        </div>
      );
    }

    if (!data) {
      return <div>No data available.</div>;
    }

    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="metrics">
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
  }
}

export default DashboardUI;

// Example ErrorBoundary component (can be in a separate file)
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
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Example LoadingSpinner component (can be in a separate file)
const LoadingSpinner = () => {
  return <div>Loading...</div>;
};

// Example fetchData function (can be in a separate file)
async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to be caught by the component
  }
}