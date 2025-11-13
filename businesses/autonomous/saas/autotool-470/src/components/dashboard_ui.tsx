// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardApi'; // Assuming an API endpoint for data
import { ErrorBoundary } from 'react-error-boundary'; // For robust error handling
import { UserContext } from '../context/UserContext'; // Assuming a User Context

interface DashboardData {
    activeUsers: number;
    monthlyRevenue: number;
    churnRate: number;
    // Add more data fields as needed
}

const DashboardUI: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = React.useContext(UserContext); // Access user information

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const data = await fetchDashboardData(user?.id); // Pass user ID for personalized data
                setDashboardData(data);
                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data. Please try again later.");
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [user?.id]);

    if (loading) {
        return <div>Loading dashboard data...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!dashboardData) {
        return <div>No dashboard data available.</div>;
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with the dashboard.</div>}>
            <div>
                <h1>Welcome, {user?.name}!</h1>
                <h2>Dashboard Overview</h2>
                <p>Active Users: {dashboardData.activeUsers}</p>
                <p>Monthly Revenue: ${dashboardData.monthlyRevenue}</p>
                <p>Churn Rate: {dashboardData.churnRate}%</p>
                {/* Add more UI elements to display the data */}
            </div>
        </ErrorBoundary>
    );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardApi'; // Assuming an API endpoint for data
import { ErrorBoundary } from 'react-error-boundary'; // For robust error handling
import { UserContext } from '../context/UserContext'; // Assuming a User Context

interface DashboardData {
    activeUsers: number;
    monthlyRevenue: number;
    churnRate: number;
    // Add more data fields as needed
}

const DashboardUI: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = React.useContext(UserContext); // Access user information

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const data = await fetchDashboardData(user?.id); // Pass user ID for personalized data
                setDashboardData(data);
                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data. Please try again later.");
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [user?.id]);

    if (loading) {
        return <div>Loading dashboard data...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!dashboardData) {
        return <div>No dashboard data available.</div>;
    }

    return (
        <ErrorBoundary fallback={<div>Something went wrong with the dashboard.</div>}>
            <div>
                <h1>Welcome, {user?.name}!</h1>
                <h2>Dashboard Overview</h2>
                <p>Active Users: {dashboardData.activeUsers}</p>
                <p>Monthly Revenue: ${dashboardData.monthlyRevenue}</p>
                <p>Churn Rate: {dashboardData.churnRate}%</p>
                {/* Add more UI elements to display the data */}
            </div>
        </ErrorBoundary>
    );
};

export default DashboardUI;