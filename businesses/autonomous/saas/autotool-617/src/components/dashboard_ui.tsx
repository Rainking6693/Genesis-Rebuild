// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assuming an API service for data fetching
import ErrorBoundary from './ErrorBoundary'; // Error boundary component
import { User } from '../types/user'; // Assuming a user type definition
import { KPI } from '../types/kpi'; // Assuming a KPI type definition
import UserList from './UserList';
import KPIDisplay from './KPIDisplay';

interface DashboardProps {
  // Define any props the dashboard needs
}

const DashboardUI: React.FC<DashboardProps> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = await fetchData<User[]>('/api/users');
        const kpisData = await fetchData<KPI[]>('/api/kpis');
        setUsers(usersData);
        setKpis(kpisData);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <section>
          <h2>Users</h2>
          <UserList users={users} />
        </section>
        <section>
          <h2>Key Performance Indicators</h2>
          <KPIDisplay kpis={kpis} />
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/UserList.tsx
import React from 'react';
import { User } from '../types/user';

interface UserListProps {
    users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.name} ({user.email})</li>
            ))}
        </ul>
    );
};

export default UserList;

// src/components/KPIDisplay.tsx
import React from 'react';
import { KPI } from '../types/kpi';

interface KPIDisplayProps {
    kpis: KPI[];
}

const KPIDisplay: React.FC<KPIDisplayProps> = ({ kpis }) => {
    return (
        <ul>
            {kpis.map(kpi => (
                <li key={kpi.id}>{kpi.name}: {kpi.value}</li>
            ))}
        </ul>
    );
};

export default KPIDisplay;

// src/components/ErrorBoundary.tsx
import React from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error: error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error("Caught error: ", error, errorInfo);
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

export default ErrorBoundary;

// src/api/dataService.ts
// Mock data fetching function (replace with actual API calls)
export async function fetchData<T>(endpoint: string): Promise<T> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (endpoint === '/api/users') {
                const mockUsers = [
                    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
                    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
                ];
                resolve(mockUsers as T);
            } else if (endpoint === '/api/kpis') {
                const mockKPIs = [
                    { id: 1, name: 'Active Users', value: 1234 },
                    { id: 2, name: 'Monthly Revenue', value: 56789 },
                ];
                resolve(mockKPIs as T);
            } else {
                reject(new Error('Endpoint not found'));
            }
        }, 500); // Simulate network latency
    });
}

// src/types/user.ts
export interface User {
    id: number;
    name: string;
    email: string;
}

// src/types/kpi.ts
export interface KPI {
    id: number;
    name: string;
    value: number;
}

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assuming an API service for data fetching
import ErrorBoundary from './ErrorBoundary'; // Error boundary component
import { User } from '../types/user'; // Assuming a user type definition
import { KPI } from '../types/kpi'; // Assuming a KPI type definition
import UserList from './UserList';
import KPIDisplay from './KPIDisplay';

interface DashboardProps {
  // Define any props the dashboard needs
}

const DashboardUI: React.FC<DashboardProps> = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = await fetchData<User[]>('/api/users');
        const kpisData = await fetchData<KPI[]>('/api/kpis');
        setUsers(usersData);
        setKpis(kpisData);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <section>
          <h2>Users</h2>
          <UserList users={users} />
        </section>
        <section>
          <h2>Key Performance Indicators</h2>
          <KPIDisplay kpis={kpis} />
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/UserList.tsx
import React from 'react';
import { User } from '../types/user';

interface UserListProps {
    users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.name} ({user.email})</li>
            ))}
        </ul>
    );
};

export default UserList;

// src/components/KPIDisplay.tsx
import React from 'react';
import { KPI } from '../types/kpi';

interface KPIDisplayProps {
    kpis: KPI[];
}

const KPIDisplay: React.FC<KPIDisplayProps> = ({ kpis }) => {
    return (
        <ul>
            {kpis.map(kpi => (
                <li key={kpi.id}>{kpi.name}: {kpi.value}</li>
            ))}
        </ul>
    );
};

export default KPIDisplay;

// src/components/ErrorBoundary.tsx
import React from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error: error, errorInfo: null };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error("Caught error: ", error, errorInfo);
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

export default ErrorBoundary;

// src/api/dataService.ts
// Mock data fetching function (replace with actual API calls)
export async function fetchData<T>(endpoint: string): Promise<T> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (endpoint === '/api/users') {
                const mockUsers = [
                    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
                    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
                ];
                resolve(mockUsers as T);
            } else if (endpoint === '/api/kpis') {
                const mockKPIs = [
                    { id: 1, name: 'Active Users', value: 1234 },
                    { id: 2, name: 'Monthly Revenue', value: 56789 },
                ];
                resolve(mockKPIs as T);
            } else {
                reject(new Error('Endpoint not found'));
            }
        }, 500); // Simulate network latency
    });
}

// src/types/user.ts
export interface User {
    id: number;
    name: string;
    email: string;
}

// src/types/kpi.ts
export interface KPI {
    id: number;
    name: string;
    value: number;
}

**Explanation:**

*   **DashboardUI.tsx:** This is the main component. It fetches user and KPI data, handles loading and error states, and renders the UserList and KPIDisplay components within an ErrorBoundary.
*   **UserList.tsx:**  A simple component to display a list of users.
*   **KPIDisplay.tsx:** A simple component to display a list of KPIs.
*   **ErrorBoundary.tsx:** A component that catches JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI.
*   **dataService.ts:**  A mock data fetching function to simulate API calls.  **Important:** This should be replaced with actual API calls in a real application.
*   **user.ts & kpi.ts:** Type definitions for User and KPI objects.

**Build Report:**