// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchData } from '../api/dataService'; // Assuming a data service exists
import Chart from 'chart.js/auto'; // Import Chart.js library
import './DashboardUI.css'; // Import CSS for styling

interface DashboardData {
    users: number;
    activeUsers: number;
    revenue: number;
    // Add more data types as needed
}

function DashboardUI() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const fetchedData = await fetchData();
                setData(fetchedData);
                setLoading(false);
            } catch (err: any) {
                setError(err);
                setLoading(false);
                console.error("Error fetching data:", err);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <div>Loading dashboard data...</div>;
    }

    if (error) {
        return (
            <div className="error-message">
                Error: {error.message}
            </div>
        );
    }

    if (!data) {
        return <div>No data available.</div>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>SaaS Dashboard</h1>
            </header>
            <aside className="dashboard-sidebar">
                <ul>
                    <li><a href="#">Overview</a></li>
                    <li><a href="#">Users</a></li>
                    <li><a href="#">Billing</a></li>
                    <li><a href="#">Settings</a></li>
                </ul>
            </aside>
            <main className="dashboard-content">
                <ErrorBoundary fallback={<div>Something went wrong with the data visualization.</div>}>
                    <DataVisualization data={data} />
                </ErrorBoundary>
            </main>
        </div>
    );
}

interface DataVisualizationProps {
    data: DashboardData;
}

function DataVisualization({ data }: DataVisualizationProps) {
    // Implement data visualization using Chart.js or other libraries
    // Example: Display a bar chart of user activity
    useEffect(() => {
        const ctx = document.getElementById('userChart') as HTMLCanvasElement;
        if (ctx) {
            const myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Users', 'Active Users'],
                    datasets: [{
                        label: 'User Activity',
                        data: [data.users, data.activeUsers],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            return () => {
                myChart.destroy(); // Destroy the chart when the component unmounts
            };
        }
    }, [data]);

    return (
        <div>
            <h2>Key Metrics</h2>
            <div className="metric-cards">
                <div className="metric-card">
                    <h3>Total Users</h3>
                    <p>{data.users}</p>
                </div>
                <div className="metric-card">
                    <h3>Active Users</h3>
                    <p>{data.activeUsers}</p>
                </div>
                <div className="metric-card">
                    <h3>Revenue</h3>
                    <p>${data.revenue}</p>
                </div>
            </div>
            <canvas id="userChart" width="400" height="200"></canvas>
        </div>
    );
}

export default DashboardUI;