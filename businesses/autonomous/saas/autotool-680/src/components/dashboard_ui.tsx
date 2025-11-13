// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSpinner } from './LoadingSpinner';

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
                const dashboardData = await fetchData<DashboardData>('/api/dashboard');
                setData(dashboardData);
                setLoading(false);
            } catch (err: any) {
                setError(err);
                setLoading(false);
                console.error("Error fetching dashboard data:", err);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <ErrorBoundary>
                <div>Error: {error.message}</div>
            </ErrorBoundary>
        );
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Users: {data?.users}</p>
            <p>Active Subscriptions: {data?.activeSubscriptions}</p>
            <p>Revenue: ${data?.revenue}</p>
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

        return await response.json() as T;
    } catch (error: any) {
        console.error("Error fetching data:", error);
        throw error;
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

export class ErrorBoundary extends React.Component<Props, State> {
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
                    <p>{this.state.error?.message}</p>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.errorInfo?.componentStack}
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
        <div>
            Loading...
        </div>
    );
};

/* build_report */
{
  "status": "success",
  "errors": [],
  "warnings": []
}

// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService';
import { ErrorBoundary } from './ErrorBoundary';
import { LoadingSpinner } from './LoadingSpinner';

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
                const dashboardData = await fetchData<DashboardData>('/api/dashboard');
                setData(dashboardData);
                setLoading(false);
            } catch (err: any) {
                setError(err);
                setLoading(false);
                console.error("Error fetching dashboard data:", err);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <ErrorBoundary>
                <div>Error: {error.message}</div>
            </ErrorBoundary>
        );
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Users: {data?.users}</p>
            <p>Active Subscriptions: {data?.activeSubscriptions}</p>
            <p>Revenue: ${data?.revenue}</p>
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

        return await response.json() as T;
    } catch (error: any) {
        console.error("Error fetching data:", error);
        throw error;
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

export class ErrorBoundary extends React.Component<Props, State> {
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
                    <p>{this.state.error?.message}</p>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.errorInfo?.componentStack}
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
        <div>
            Loading...
        </div>
    );
};

/* build_report */
{
  "status": "success",
  "errors": [],
  "warnings": []
}