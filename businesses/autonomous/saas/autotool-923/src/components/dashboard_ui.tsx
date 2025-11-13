// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardService'; // Assuming an API service exists
import { ErrorBoundary } from './ErrorBoundary'; // Utilizing error boundary pattern
import LoadingSpinner from './LoadingSpinner'; // For loading states

interface DashboardData {
    activeUsers: number;
    monthlyRevenue: number;
    churnRate: number;
    // Add other relevant data types here
}

const DashboardUI: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchDashboardData();
                setDashboardData(data);
            } catch (err: any) {
                setError(err);
                console.error("Error fetching dashboard data:", err); // Log the error
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="error-message">
                Error: {error.message}
                <p>Please try again later.</p>
            </div>
        );
    }

    if (!dashboardData) {
        return <div>No data available.</div>;
    }

    return (
        <ErrorBoundary>
            <div className="dashboard">
                <h1>Dashboard</h1>
                <div className="metrics">
                    <div className="metric-card">
                        <h2>Active Users</h2>
                        <p>{dashboardData.activeUsers}</p>
                    </div>
                    <div className="metric-card">
                        <h2>Monthly Revenue</h2>
                        <p>${dashboardData.monthlyRevenue}</p>
                    </div>
                    <div className="metric-card">
                        <h2>Churn Rate</h2>
                        <p>{dashboardData.churnRate}%</p>
                    </div>
                </div>
                {/* Add more components and data displays here */}
            </div>
        </ErrorBoundary>
    );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardService'; // Assuming an API service exists
import { ErrorBoundary } from './ErrorBoundary'; // Utilizing error boundary pattern
import LoadingSpinner from './LoadingSpinner'; // For loading states

interface DashboardData {
    activeUsers: number;
    monthlyRevenue: number;
    churnRate: number;
    // Add other relevant data types here
}

const DashboardUI: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchDashboardData();
                setDashboardData(data);
            } catch (err: any) {
                setError(err);
                console.error("Error fetching dashboard data:", err); // Log the error
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="error-message">
                Error: {error.message}
                <p>Please try again later.</p>
            </div>
        );
    }

    if (!dashboardData) {
        return <div>No data available.</div>;
    }

    return (
        <ErrorBoundary>
            <div className="dashboard">
                <h1>Dashboard</h1>
                <div className="metrics">
                    <div className="metric-card">
                        <h2>Active Users</h2>
                        <p>{dashboardData.activeUsers}</p>
                    </div>
                    <div className="metric-card">
                        <h2>Monthly Revenue</h2>
                        <p>${dashboardData.monthlyRevenue}</p>
                    </div>
                    <div className="metric-card">
                        <h2>Churn Rate</h2>
                        <p>{dashboardData.churnRate}%</p>
                    </div>
                </div>
                {/* Add more components and data displays here */}
            </div>
        </ErrorBoundary>
    );
};

export default DashboardUI;