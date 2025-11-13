// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';

interface DashboardProps {
  // Define props for the dashboard
}

interface DashboardState {
  isLoading: boolean;
  data: any; // Replace 'any' with a more specific type
  error: Error | null;
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
    console.error("Caught an error in ErrorBoundary: ", error, errorInfo);
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
  const [state, setState] = useState<DashboardState>({
    isLoading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        const response = await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulate success
            resolve({ message: "Dashboard data loaded successfully!" });
            // Simulate error
            // reject(new Error("Failed to fetch data"));
          }, 1500);
        });

        // Type assertion to ensure response is of type 'any'
        const data = response as any;

        setState({ ...state, isLoading: false, data: data, error: null });
      } catch (error: any) { // Explicitly type 'error' as 'any'
        setState({ ...state, isLoading: false, error: error, data: null });
      }
    };

    fetchData();
  }, []);

  if (state.isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error.message}</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        <p>{state.data.message}</p>
        {/* Add more dashboard components here */}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';

interface DashboardProps {
  // Define props for the dashboard
}

interface DashboardState {
  isLoading: boolean;
  data: any; // Replace 'any' with a more specific type
  error: Error | null;
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
    console.error("Caught an error in ErrorBoundary: ", error, errorInfo);
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
  const [state, setState] = useState<DashboardState>({
    isLoading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        const response = await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulate success
            resolve({ message: "Dashboard data loaded successfully!" });
            // Simulate error
            // reject(new Error("Failed to fetch data"));
          }, 1500);
        });

        // Type assertion to ensure response is of type 'any'
        const data = response as any;

        setState({ ...state, isLoading: false, data: data, error: null });
      } catch (error: any) { // Explicitly type 'error' as 'any'
        setState({ ...state, isLoading: false, error: error, data: null });
      }
    };

    fetchData();
  }, []);

  if (state.isLoading) {
    return <div>Loading dashboard data...</div>;
  }

  if (state.error) {
    return <div>Error: {state.error.message}</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        <p>{state.data.message}</p>
        {/* Add more dashboard components here */}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;