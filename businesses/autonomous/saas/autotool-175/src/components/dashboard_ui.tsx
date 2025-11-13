// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assume this service exists
import { ErrorBoundary } from './ErrorBoundary'; // Assume this component exists
import { LoadingSpinner } from './LoadingSpinner'; // Assume this component exists

interface DashboardData {
    users: number;
    activeUsers: number;
    revenue: number;
    error?: string;
}

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData>({ users: 0, activeUsers: 0, revenue: 0 });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const dashboardData = await fetchData();
                setData(dashboardData);
                setLoading(false);
            } catch (e: any) {
                console.error("Error fetching dashboard data:", e);
                setError("Failed to load dashboard data. Please try again later.");
                setLoading(false);
            }
        };

        loadData();
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
            <div className="dashboard error">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="dashboard">
                <h1>Dashboard</h1>
                <div className="data-container">
                    <div className="data-item">
                        <h2>Total Users</h2>
                        <p>{data.users}</p>
                    </div>
                    <div className="data-item">
                        <h2>Active Users</h2>
                        <p>{data.activeUsers}</p>
                    </div>
                    <div className="data-item">
                        <h2>Revenue</h2>
                        <p>${data.revenue}</p>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default Dashboard;

// src/api/dataService.ts
export async function fetchData(): Promise<any> {
    try {
        const response = await fetch('/api/dashboardData');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error("Error fetching data:", error);
        throw new Error("Failed to fetch data from the server.");
    }
}

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
        console.error("Caught error:", error, errorInfo);
        this.setState({ errorInfo: errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <p>Error: {this.state.error?.message}</p>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.errorInfo?.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export { ErrorBoundary };

// src/components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

export { LoadingSpinner };

// types/index.d.ts
export interface DashboardData {
    users: number;
    activeUsers: number;
    revenue: number;
    error?: string;
}

// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assume this service exists
import { ErrorBoundary } from './ErrorBoundary'; // Assume this component exists
import { LoadingSpinner } from './LoadingSpinner'; // Assume this component exists

interface DashboardData {
    users: number;
    activeUsers: number;
    revenue: number;
    error?: string;
}

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData>({ users: 0, activeUsers: 0, revenue: 0 });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const dashboardData = await fetchData();
                setData(dashboardData);
                setLoading(false);
            } catch (e: any) {
                console.error("Error fetching dashboard data:", e);
                setError("Failed to load dashboard data. Please try again later.");
                setLoading(false);
            }
        };

        loadData();
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
            <div className="dashboard error">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="dashboard">
                <h1>Dashboard</h1>
                <div className="data-container">
                    <div className="data-item">
                        <h2>Total Users</h2>
                        <p>{data.users}</p>
                    </div>
                    <div className="data-item">
                        <h2>Active Users</h2>
                        <p>{data.activeUsers}</p>
                    </div>
                    <div className="data-item">
                        <h2>Revenue</h2>
                        <p>${data.revenue}</p>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default Dashboard;

// src/api/dataService.ts
export async function fetchData(): Promise<any> {
    try {
        const response = await fetch('/api/dashboardData');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error("Error fetching data:", error);
        throw new Error("Failed to fetch data from the server.");
    }
}

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
        console.error("Caught error:", error, errorInfo);
        this.setState({ errorInfo: errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <p>Error: {this.state.error?.message}</p>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.errorInfo?.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

export { ErrorBoundary };

// src/components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

export { LoadingSpinner };

// types/index.d.ts
export interface DashboardData {
    users: number;
    activeUsers: number;
    revenue: number;
    error?: string;
}