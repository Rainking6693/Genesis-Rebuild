// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';

interface DashboardData {
  activeUsers: number;
  monthlyRevenue: number;
  churnRate: number;
  // Add more data fields as needed
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

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error in ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        const response = await new Promise<DashboardData>((resolve, reject) => {
          setTimeout(() => {
            // Simulate success or failure
            const success = Math.random() > 0.1; // Simulate a 10% chance of failure
            if (success) {
              resolve({
                activeUsers: 1234,
                monthlyRevenue: 56789,
                churnRate: 0.05,
              });
            } else {
              reject(new Error("Failed to fetch dashboard data."));
            }
          }, 1000); // Simulate a 1 second delay
        });

        setDashboardData(response);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
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

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        <p>Active Users: {dashboardData.activeUsers}</p>
        <p>Monthly Revenue: ${dashboardData.monthlyRevenue}</p>
        <p>Churn Rate: {dashboardData.churnRate * 100}%</p>
        {/* Add more UI elements to display the data */}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';

interface DashboardData {
  activeUsers: number;
  monthlyRevenue: number;
  churnRate: number;
  // Add more data fields as needed
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

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error in ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        const response = await new Promise<DashboardData>((resolve, reject) => {
          setTimeout(() => {
            // Simulate success or failure
            const success = Math.random() > 0.1; // Simulate a 10% chance of failure
            if (success) {
              resolve({
                activeUsers: 1234,
                monthlyRevenue: 56789,
                churnRate: 0.05,
              });
            } else {
              reject(new Error("Failed to fetch dashboard data."));
            }
          }, 1000); // Simulate a 1 second delay
        });

        setDashboardData(response);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
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

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        <p>Active Users: {dashboardData.activeUsers}</p>
        <p>Monthly Revenue: ${dashboardData.monthlyRevenue}</p>
        <p>Churn Rate: {dashboardData.churnRate * 100}%</p>
        {/* Add more UI elements to display the data */}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;