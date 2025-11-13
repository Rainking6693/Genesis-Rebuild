// src/components/DashboardUI.tsx

import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service exists
import { User } from '../types/user'; // Assuming a user type exists
import ErrorBoundary from './ErrorBoundary'; // Custom error boundary component
import LoadingIndicator from './LoadingIndicator'; // Custom loading indicator

interface DashboardProps {
  user: User;
}

interface DashboardState {
  data: any;
  loading: boolean;
  error: Error | null;
}

// Error Boundary Component
class DashboardErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
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
    console.error("Caught an error in DashboardErrorBoundary: ", error, errorInfo);
    //logErrorToMyService(error, errorInfo); // Example of logging to a service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

const DashboardUI: React.FC<DashboardProps> = ({ user }) => {
  const [state, setState] = useState<DashboardState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData(user.id); // Assuming fetchData takes a user ID
        setState({ data: fetchedData, loading: false, error: null });
      } catch (error: any) {
        console.error("Error fetching data: ", error);
        setState({ data: null, loading: false, error: error });
      }
    };

    loadData();
  }, [user.id]);

  if (state.loading) {
    return <LoadingIndicator />;
  }

  if (state.error) {
    return (
      <div>
        <h2>Error:</h2>
        <p>{state.error.message}</p>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <div>
        <h1>Welcome, {user.name}!</h1>
        {state.data && (
          <div>
            <h2>Dashboard Data:</h2>
            <pre>{JSON.stringify(state.data, null, 2)}</pre>
          </div>
        )}
      </div>
    </DashboardErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx

import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service exists
import { User } from '../types/user'; // Assuming a user type exists
import ErrorBoundary from './ErrorBoundary'; // Custom error boundary component
import LoadingIndicator from './LoadingIndicator'; // Custom loading indicator

interface DashboardProps {
  user: User;
}

interface DashboardState {
  data: any;
  loading: boolean;
  error: Error | null;
}

// Error Boundary Component
class DashboardErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
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
    console.error("Caught an error in DashboardErrorBoundary: ", error, errorInfo);
    //logErrorToMyService(error, errorInfo); // Example of logging to a service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

const DashboardUI: React.FC<DashboardProps> = ({ user }) => {
  const [state, setState] = useState<DashboardState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData(user.id); // Assuming fetchData takes a user ID
        setState({ data: fetchedData, loading: false, error: null });
      } catch (error: any) {
        console.error("Error fetching data: ", error);
        setState({ data: null, loading: false, error: error });
      }
    };

    loadData();
  }, [user.id]);

  if (state.loading) {
    return <LoadingIndicator />;
  }

  if (state.error) {
    return (
      <div>
        <h2>Error:</h2>
        <p>{state.error.message}</p>
      </div>
    );
  }

  return (
    <DashboardErrorBoundary>
      <div>
        <h1>Welcome, {user.name}!</h1>
        {state.data && (
          <div>
            <h2>Dashboard Data:</h2>
            <pre>{JSON.stringify(state.data, null, 2)}</pre>
          </div>
        )}
      </div>
    </DashboardErrorBoundary>
  );
};

export default DashboardUI;