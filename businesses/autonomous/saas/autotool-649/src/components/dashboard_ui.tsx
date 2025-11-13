// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

interface DashboardData {
    users: number;
    activeUsers: number;
    revenue: number;
}

const DashboardUI = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate fetching data from an API
                setLoading(true);
                const response = await new Promise<DashboardData>((resolve) => {
                    setTimeout(() => {
                        resolve({
                            users: 1200,
                            activeUsers: 800,
                            revenue: 50000,
                        });
                    }, 1000); // Simulate API delay
                });

                setDashboardData(response);
                setLoading(false);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch dashboard data.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading dashboard data...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Router>
            <div className="dashboard-container">
                <nav className="dashboard-nav">
                    <ul>
                        <li><Link to="/">Overview</Link></li>
                        <li><Link to="/users">Users</Link></li>
                        <li><Link to="/settings">Settings</Link></li>
                    </ul>
                </nav>

                <main className="dashboard-content">
                    <h1>Dashboard Overview</h1>

                    {dashboardData && (
                        <div className="dashboard-metrics">
                            <div className="metric-card">
                                <h3>Total Users</h3>
                                <p>{dashboardData.users}</p>
                            </div>
                            <div className="metric-card">
                                <h3>Active Users</h3>
                                <p>{dashboardData.activeUsers}</p>
                            </div>
                            <div className="metric-card">
                                <h3>Revenue</h3>
                                <p>${dashboardData.revenue}</p>
                            </div>
                        </div>
                    )}

                    <Routes>
                        <Route path="/" element={<div>Overview Content</div>} />
                        <Route path="/users" element={<div>Users Content</div>} />
                        <Route path="/settings" element={<div>Settings Content</div>} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default DashboardUI;