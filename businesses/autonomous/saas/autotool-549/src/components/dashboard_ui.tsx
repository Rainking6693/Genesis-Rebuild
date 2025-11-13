// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface UserProfile {
  name: string;
  email: string;
  // Add more profile properties as needed
}

interface DashboardData {
  // Define the structure of your dashboard data here
  // Example:
  users: number;
  activeUsers: number;
  revenue: number;
}

const ErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={reset}>Try again</button>
    </div>
  );
};

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><a href="#">Dashboard</a></li>
        <li><a href="#">Users</a></li>
        <li><a href="#">Settings</a></li>
      </ul>
    </nav>
  );
};

const DataVisualization = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        const response = await new Promise<DashboardData>((resolve) =>
          setTimeout(() => resolve({ users: 100, activeUsers: 80, revenue: 10000 }), 1000)
        );
        setData(response);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!data) {
    return <p>No data available.</p>;
  }

  return (
    <div>
      <h2>Data Visualization</h2>
      <p>Total Users: {data.users}</p>
      <p>Active Users: {data.activeUsers}</p>
      <p>Revenue: ${data.revenue}</p>
      {/* Add charts and graphs here */}
    </div>
  );
};

const UserProfileSection = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Simulate fetching user profile data
        const response = await new Promise<UserProfile>((resolve) =>
          setTimeout(() => resolve({ name: 'John Doe', email: 'john.doe@example.com' }), 500)
        );
        setUser(response);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <p>Loading user profile...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>No user profile available.</p>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

const DashboardUI = () => {
  return (
    <div>
      <Navigation />
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
        <DataVisualization />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
        <UserProfileSection />
      </ErrorBoundary>
    </div>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface UserProfile {
  name: string;
  email: string;
  // Add more profile properties as needed
}

interface DashboardData {
  // Define the structure of your dashboard data here
  // Example:
  users: number;
  activeUsers: number;
  revenue: number;
}

const ErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={reset}>Try again</button>
    </div>
  );
};

const Navigation = () => {
  return (
    <nav>
      <ul>
        <li><a href="#">Dashboard</a></li>
        <li><a href="#">Users</a></li>
        <li><a href="#">Settings</a></li>
      </ul>
    </nav>
  );
};

const DataVisualization = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        const response = await new Promise<DashboardData>((resolve) =>
          setTimeout(() => resolve({ users: 100, activeUsers: 80, revenue: 10000 }), 1000)
        );
        setData(response);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!data) {
    return <p>No data available.</p>;
  }

  return (
    <div>
      <h2>Data Visualization</h2>
      <p>Total Users: {data.users}</p>
      <p>Active Users: {data.activeUsers}</p>
      <p>Revenue: ${data.revenue}</p>
      {/* Add charts and graphs here */}
    </div>
  );
};

const UserProfileSection = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Simulate fetching user profile data
        const response = await new Promise<UserProfile>((resolve) =>
          setTimeout(() => resolve({ name: 'John Doe', email: 'john.doe@example.com' }), 500)
        );
        setUser(response);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <p>Loading user profile...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>No user profile available.</p>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

const DashboardUI = () => {
  return (
    <div>
      <Navigation />
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
        <DataVisualization />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
        <UserProfileSection />
      </ErrorBoundary>
    </div>
  );
};

export default DashboardUI;