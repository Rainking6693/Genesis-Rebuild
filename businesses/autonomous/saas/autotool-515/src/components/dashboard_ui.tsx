// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

interface Props {
  children?: ReactNode;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const DashboardUI = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

        const mockData: DashboardData = {
          users: 1250,
          activeUsers: 980,
          revenue: 55000,
          churnRate: 0.05,
        };

        setData(mockData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        <p>Total Users: {data.users}</p>
        <p>Active Users: {data.activeUsers}</p>
        <p>Revenue: ${data.revenue}</p>
        <p>Churn Rate: {data.churnRate * 100}%</p>
        {/* Add more UI elements here */}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
}

interface Props {
  children?: ReactNode;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const DashboardUI = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

        const mockData: DashboardData = {
          users: 1250,
          activeUsers: 980,
          revenue: 55000,
          churnRate: 0.05,
        };

        setData(mockData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        <p>Total Users: {data.users}</p>
        <p>Active Users: {data.activeUsers}</p>
        <p>Revenue: ${data.revenue}</p>
        <p>Churn Rate: {data.churnRate * 100}%</p>
        {/* Add more UI elements here */}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;