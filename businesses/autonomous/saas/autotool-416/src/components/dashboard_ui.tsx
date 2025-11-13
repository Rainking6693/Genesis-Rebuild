// src/components/DashboardUI.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service
import ErrorBoundary from './ErrorBoundary'; // Custom error boundary component
import LoadingSpinner from './LoadingSpinner'; // Custom loading spinner

interface DashboardData {
    userCount: number;
    activeUsers: number;
    revenue: number;
    // Add more data types as needed
}

const DashboardUI = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchData(); // Replace with actual API call
                setDashboardData(data);
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

    if (!dashboardData) {
        return <div>No data available.</div>;
    }

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="data-section">
                <h2>User Statistics</h2>
                <p>Total Users: {dashboardData.userCount}</p>
                <p>Active Users: {dashboardData.activeUsers}</p>
            </div>
            <div className="data-section">
                <h2>Revenue</h2>
                <p>Total Revenue: ${dashboardData.revenue}</p>
            </div>
            {/* Add more sections for data visualizations, charts, etc. */}
        </div>
    );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect, Suspense } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service
import ErrorBoundary from './ErrorBoundary'; // Custom error boundary component
import LoadingSpinner from './LoadingSpinner'; // Custom loading spinner

interface DashboardData {
    userCount: number;
    activeUsers: number;
    revenue: number;
    // Add more data types as needed
}

const DashboardUI = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchData(); // Replace with actual API call
                setDashboardData(data);
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

    if (!dashboardData) {
        return <div>No data available.</div>;
    }

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="data-section">
                <h2>User Statistics</h2>
                <p>Total Users: {dashboardData.userCount}</p>
                <p>Active Users: {dashboardData.activeUsers}</p>
            </div>
            <div className="data-section">
                <h2>Revenue</h2>
                <p>Total Revenue: ${dashboardData.revenue}</p>
            </div>
            {/* Add more sections for data visualizations, charts, etc. */}
        </div>
    );
};

export default DashboardUI;