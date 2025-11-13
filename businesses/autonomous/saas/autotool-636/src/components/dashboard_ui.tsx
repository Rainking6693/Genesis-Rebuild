// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from '../utils/api'; // Assuming an API utility
import ErrorBoundary from './ErrorBoundary'; // Assuming an ErrorBoundary component

interface DashboardData {
    activeUsers: number;
    monthlyRevenue: number;
    churnRate: number;
}

const DashboardUI = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const dashboardData = await fetchData<DashboardData>('/api/dashboard');
                setData(dashboardData);
                setLoading(false);
            } catch (e: any) {
                console.error("Error fetching dashboard data:", e);
                setError("Failed to load dashboard data.");
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

    if (!data) {
        return <div>No data available.</div>;
    }

    return (
        <ErrorBoundary>
            <div>
                <h1>Dashboard</h1>
                <p>Active Users: {data.activeUsers}</p>
                <p>Monthly Revenue: ${data.monthlyRevenue}</p>
                <p>Churn Rate: {data.churnRate}%</p>
                {/* Add more UI elements and components here */}
            </div>
        </ErrorBoundary>
    );
};

export default DashboardUI;