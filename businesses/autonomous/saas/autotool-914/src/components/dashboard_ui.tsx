// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assume this service exists
import { ErrorBoundary } from './ErrorBoundary'; // Assume this component exists
import { LoadingSpinner } from './LoadingSpinner'; // Assume this component exists

interface DashboardData {
    users: number;
    activeSubscriptions: number;
    revenue: number;
}

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const dashboardData = await fetchData<DashboardData>('/dashboard');
                setData(dashboardData);
                setLoading(false);
            } catch (err: any) {
                setError(err);
                setLoading(false);
                console.error("Error fetching dashboard data:", err); // Log the error
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
            <div className="dashboard">
                <ErrorBoundary error={error}>
                    <p>Error loading dashboard data. Please try again later.</p>
                </ErrorBoundary>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="dashboard-metrics">
                <div className="metric">
                    <h2>Users</h2>
                    <p>{data?.users || 'N/A'}</p>
                </div>
                <div className="metric">
                    <h2>Active Subscriptions</h2>
                    <p>{data?.activeSubscriptions || 'N/A'}</p>
                </div>
                <div className="metric">
                    <h2>Revenue</h2>
                    <p>${data?.revenue || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

// src/api/dataService.ts

export async function fetchData<T>(url: string): Promise<T> {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: T = await response.json();
        return data;
    } catch (error: any) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw the error to be caught by the component
    }
}

// src/components/ErrorBoundary.tsx
import React from 'react';

interface Props {
    children: React.ReactNode;
    error: Error | null;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        console.error("Caught an error in ErrorBoundary:", error);
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error("Error caught in componentDidCatch:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.props.error?.toString()}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

// src/components/LoadingSpinner.tsx
import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
};

// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assume this service exists
import { ErrorBoundary } from './ErrorBoundary'; // Assume this component exists
import { LoadingSpinner } from './LoadingSpinner'; // Assume this component exists

interface DashboardData {
    users: number;
    activeSubscriptions: number;
    revenue: number;
}

const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const dashboardData = await fetchData<DashboardData>('/dashboard');
                setData(dashboardData);
                setLoading(false);
            } catch (err: any) {
                setError(err);
                setLoading(false);
                console.error("Error fetching dashboard data:", err); // Log the error
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
            <div className="dashboard">
                <ErrorBoundary error={error}>
                    <p>Error loading dashboard data. Please try again later.</p>
                </ErrorBoundary>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="dashboard-metrics">
                <div className="metric">
                    <h2>Users</h2>
                    <p>{data?.users || 'N/A'}</p>
                </div>
                <div className="metric">
                    <h2>Active Subscriptions</h2>
                    <p>{data?.activeSubscriptions || 'N/A'}</p>
                </div>
                <div className="metric">
                    <h2>Revenue</h2>
                    <p>${data?.revenue || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

// src/api/dataService.ts

export async function fetchData<T>(url: string): Promise<T> {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: T = await response.json();
        return data;
    } catch (error: any) {
        console.error("Error fetching data:", error);
        throw error; // Re-throw the error to be caught by the component
    }
}

// src/components/ErrorBoundary.tsx
import React from 'react';

interface Props {
    children: React.ReactNode;
    error: Error | null;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        // Update state so the next render will show the fallback UI.
        console.error("Caught an error in ErrorBoundary:", error);
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // You can also log the error to an error reporting service
        console.error("Error caught in componentDidCatch:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.props.error?.toString()}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}

// src/components/LoadingSpinner.tsx
import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
};