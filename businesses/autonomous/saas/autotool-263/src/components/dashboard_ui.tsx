// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { fetchData } from '../utils/api'; // Assuming an API utility
import { LoadingSpinner } from './LoadingSpinner'; // Assuming a loading spinner component
import { ErrorBoundary } from './ErrorBoundary'; // Assuming an error boundary component

interface DashboardData {
  userCount: number;
  activeUsers: number;
  revenue: number;
  // Add more data types as needed
}

interface Props {
  children?: ReactNode;
}

function DashboardUI({ children }: Props) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with your actual API endpoint
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <p>Error loading dashboard data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>User Count: {dashboardData?.userCount}</p>
      <p>Active Users: {dashboardData?.activeUsers}</p>
      <p>Revenue: ${dashboardData?.revenue}</p>
      {children}
    </div>
  );
}

export default DashboardUI;

// Example Error Boundary Component (assuming it exists)
// class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
//   constructor(props: Props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error: Error) {
//     // Update state so the next render will show the fallback UI.
//     return { hasError: true };
//   }

//   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
//     // You can also log the error to an error reporting service
//     console.error("Caught an error in ErrorBoundary:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       // You can render any custom fallback UI
//       return <h1>Something went wrong.</h1>;
//     }

//     return this.props.children;
//   }
// }

// Example Loading Spinner Component (assuming it exists)
// function LoadingSpinner() {
//   return <div>Loading...</div>;
// }

// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { fetchData } from '../utils/api'; // Assuming an API utility
import { LoadingSpinner } from './LoadingSpinner'; // Assuming a loading spinner component
import { ErrorBoundary } from './ErrorBoundary'; // Assuming an error boundary component

interface DashboardData {
  userCount: number;
  activeUsers: number;
  revenue: number;
  // Add more data types as needed
}

interface Props {
  children?: ReactNode;
}

function DashboardUI({ children }: Props) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with your actual API endpoint
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <p>Error loading dashboard data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>User Count: {dashboardData?.userCount}</p>
      <p>Active Users: {dashboardData?.activeUsers}</p>
      <p>Revenue: ${dashboardData?.revenue}</p>
      {children}
    </div>
  );
}

export default DashboardUI;

// Example Error Boundary Component (assuming it exists)
// class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
//   constructor(props: Props) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error: Error) {
//     // Update state so the next render will show the fallback UI.
//     return { hasError: true };
//   }

//   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
//     // You can also log the error to an error reporting service
//     console.error("Caught an error in ErrorBoundary:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       // You can render any custom fallback UI
//       return <h1>Something went wrong.</h1>;
//     }

//     return this.props.children;
//   }
// }

// Example Loading Spinner Component (assuming it exists)
// function LoadingSpinner() {
//   return <div>Loading...</div>;
// }