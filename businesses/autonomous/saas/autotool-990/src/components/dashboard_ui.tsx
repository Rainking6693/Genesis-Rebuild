// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardApi'; // Assuming an API endpoint exists
import { ErrorBoundary } from './ErrorBoundary'; // Reusable error boundary component
import LoadingSpinner from './LoadingSpinner'; // Reusable loading spinner component
import { useUserContext } from '../context/UserContext'; // Example: User context

interface DashboardData {
    activeUsers: number;
    totalRevenue: number;
    newSignups: number;
    // Add more data fields as needed
}

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { user } = useUserContext(); // Example: Access user data

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchDashboardData();
                setDashboardData(data);
            } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
                console.error("Error fetching dashboard data:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <LoadingSpinner />
                <p>Loading Dashboard Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500">
                <p>Error: {error.message}</p>
                <p>Please try again later.</p>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                {user && <p>Welcome, {user.name}!</p>} {/* Example: Display user info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white shadow-md rounded-md p-4">
                        <h2 className="text-lg font-semibold">Active Users</h2>
                        <p className="text-3xl">{dashboardData?.activeUsers || 0}</p>
                    </div>
                    <div className="bg-white shadow-md rounded-md p-4">
                        <h2 className="text-lg font-semibold">Total Revenue</h2>
                        <p className="text-3xl">${dashboardData?.totalRevenue || 0}</p>
                    </div>
                    <div className="bg-white shadow-md rounded-md p-4">
                        <h2 className="text-lg font-semibold">New Signups</h2>
                        <p className="text-3xl">{dashboardData?.newSignups || 0}</p>
                    </div>
                </div>
                {/* Add more dashboard components and visualizations here */}
            </div>
        </ErrorBoundary>
    );
};

export default Dashboard;

// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardApi'; // Assuming an API endpoint exists
import { ErrorBoundary } from './ErrorBoundary'; // Reusable error boundary component
import LoadingSpinner from './LoadingSpinner'; // Reusable loading spinner component
import { useUserContext } from '../context/UserContext'; // Example: User context

interface DashboardData {
    activeUsers: number;
    totalRevenue: number;
    newSignups: number;
    // Add more data fields as needed
}

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { user } = useUserContext(); // Example: Access user data

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchDashboardData();
                setDashboardData(data);
            } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
                console.error("Error fetching dashboard data:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <LoadingSpinner />
                <p>Loading Dashboard Data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500">
                <p>Error: {error.message}</p>
                <p>Please try again later.</p>
            </div>
        );
    }

    return (
        <ErrorBoundary>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                {user && <p>Welcome, {user.name}!</p>} {/* Example: Display user info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white shadow-md rounded-md p-4">
                        <h2 className="text-lg font-semibold">Active Users</h2>
                        <p className="text-3xl">{dashboardData?.activeUsers || 0}</p>
                    </div>
                    <div className="bg-white shadow-md rounded-md p-4">
                        <h2 className="text-lg font-semibold">Total Revenue</h2>
                        <p className="text-3xl">${dashboardData?.totalRevenue || 0}</p>
                    </div>
                    <div className="bg-white shadow-md rounded-md p-4">
                        <h2 className="text-lg font-semibold">New Signups</h2>
                        <p className="text-3xl">{dashboardData?.newSignups || 0}</p>
                    </div>
                </div>
                {/* Add more dashboard components and visualizations here */}
            </div>
        </ErrorBoundary>
    );
};

export default Dashboard;

Now, I will use the `Write` tool to save the code to `src/components/Dashboard.tsx` and then output the build report.