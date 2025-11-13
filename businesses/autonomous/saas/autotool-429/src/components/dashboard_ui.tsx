// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { fetchData } from '../utils/api'; // Assuming an API utility
import { UserContext } from '../context/UserContext'; // Assuming a user context
import { useContext } from 'react';

interface DashboardProps {
  children?: ReactNode;
}

interface DashboardState {
  isLoading: boolean;
  data: any;
  error: Error | null;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<DashboardProps, { hasError: boolean }> {
  constructor(props: DashboardProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error in ErrorBoundary: ", error, errorInfo);
    //logErrorToMyService(error, errorInfo); // Example of logging to a service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '20px', border: '1px solid red', backgroundColor: '#ffe6e6' }}>
          <h2>Something went wrong.</h2>
          <p>Please try refreshing the page or contact support.</p>
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

  const { user } = useContext(UserContext); // Access user context

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData(`/api/dashboard?userId=${user?.id}`); // Fetch data based on user
        setState({ isLoading: false, data, error: null });
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        setState({ isLoading: false, data: null, error: error as Error }); // Explicitly cast to Error
      }
    };

    loadData();
  }, [user]); // Re-fetch data when user changes

  if (state.isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (state.error) {
    return (
      <div style={{ padding: '20px', border: '1px solid red', backgroundColor: '#ffe6e6' }}>
        <h2>Error loading dashboard data:</h2>
        <p>{state.error.message}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <h1>Welcome to your Dashboard!</h1>
        {state.data && (
          <div>
            {/* Render dashboard content based on fetched data */}
            <pre>{JSON.stringify(state.data, null, 2)}</pre>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { fetchData } from '../utils/api'; // Assuming an API utility
import { UserContext } from '../context/UserContext'; // Assuming a user context
import { useContext } from 'react';

interface DashboardProps {
  children?: ReactNode;
}

interface DashboardState {
  isLoading: boolean;
  data: any;
  error: Error | null;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<DashboardProps, { hasError: boolean }> {
  constructor(props: DashboardProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error in ErrorBoundary: ", error, errorInfo);
    //logErrorToMyService(error, errorInfo); // Example of logging to a service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '20px', border: '1px solid red', backgroundColor: '#ffe6e6' }}>
          <h2>Something went wrong.</h2>
          <p>Please try refreshing the page or contact support.</p>
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

  const { user } = useContext(UserContext); // Access user context

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData(`/api/dashboard?userId=${user?.id}`); // Fetch data based on user
        setState({ isLoading: false, data, error: null });
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        setState({ isLoading: false, data: null, error: error as Error }); // Explicitly cast to Error
      }
    };

    loadData();
  }, [user]); // Re-fetch data when user changes

  if (state.isLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (state.error) {
    return (
      <div style={{ padding: '20px', border: '1px solid red', backgroundColor: '#ffe6e6' }}>
        <h2>Error loading dashboard data:</h2>
        <p>{state.error.message}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <h1>Welcome to your Dashboard!</h1>
        {state.data && (
          <div>
            {/* Render dashboard content based on fetched data */}
            <pre>{JSON.stringify(state.data, null, 2)}</pre>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;