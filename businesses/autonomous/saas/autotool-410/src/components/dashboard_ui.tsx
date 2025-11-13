// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service
import { ErrorBoundary } from './ErrorBoundary'; // Custom Error Boundary Component
import { LoadingSpinner } from './LoadingSpinner'; // Custom Loading Spinner Component

interface DashboardData {
  users: number;
  activeSubscriptions: number;
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
    try {
      const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with your API endpoint
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
          <button onClick={() => this.loadData()}>Retry</button>
        </div>
      );
    }

    if (!data) {
      return <div>No data available.</div>;
    }

    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="data-grid">
          <div className="data-item">
            <h2>Users</h2>
            <p>{data.users}</p>
          </div>
          <div className="data-item">
            <h2>Active Subscriptions</h2>
            <p>{data.activeSubscriptions}</p>
          </div>
          <div className="data-item">
            <h2>Revenue</h2>
            <p>${data.revenue}</p>
          </div>
          <div className="data-item">
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
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
    // Log the error to an error reporting service
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
function LoadingSpinner() {
  return <div>Loading...</div>;
}