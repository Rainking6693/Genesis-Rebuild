// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';

interface DashboardProps {
  // Define props here, e.g., data sources, user info
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
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

const DashboardUI: React.FC<DashboardProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null); // Replace 'any' with a more specific type

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        const response = await fetch('/api/dashboard-data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
        // Consider setting an error state to display an error message to the user
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (!data) {
    return <div>Error loading dashboard data. Please try again later.</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>SaaS Dashboard</h1>
        <nav>
          {/* Navigation links */}
          <ul>
            <li><a href="#">Overview</a></li>
            <li><a href="#">Users</a></li>
            <li><a href="#">Billing</a></li>
            <li><a href="#">Settings</a></li>
          </ul>
        </nav>

        <main>
          {/* Display data here */}
          <section>
            <h2>Key Metrics</h2>
            {/* Example: Displaying user count */}
            <p>Total Users: {data.totalUsers}</p>
            {/* Add more metrics as needed */}
          </section>

          <section>
            <h2>Recent Activity</h2>
            {/* Display recent activity logs */}
            <ul>
              {data.recentActivity.map((activity: any, index: number) => ( // Replace 'any' with a more specific type
                <li key={index}>{activity.message}</li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;