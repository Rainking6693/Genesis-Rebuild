// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material'; // Using Material UI for styling
import { fetchUserStats, fetchRecentActivity, fetchKPIs } from '../api/dashboardApi'; // Placeholder API calls

interface UserStats {
    activeUsers: number;
    newUsers: number;
    churnRate: number;
}

interface Activity {
    timestamp: string;
    description: string;
}

interface KPIs {
    revenue: number;
    customerSatisfaction: number;
}

const DashboardUI = () => {
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<Activity[] | null>(null);
    const [kpis, setKpis] = useState<KPIs | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userStatsData = await fetchUserStats();
                setUserStats(userStatsData);

                const recentActivityData = await fetchRecentActivity();
                setRecentActivity(recentActivityData);

                const kpisData = await fetchKPIs();
                setKpis(kpisData);

                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <Alert severity="error">{error}</Alert>
        );
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">User Statistics</Typography>
                        <Typography variant="body1">Active Users: {userStats?.activeUsers}</Typography>
                        <Typography variant="body1">New Users: {userStats?.newUsers}</Typography>
                        <Typography variant="body1">Churn Rate: {userStats?.churnRate}%</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Recent Activity</Typography>
                        {recentActivity?.map((activity, index) => (
                            <Typography key={index} variant="body2">
                                {activity.timestamp}: {activity.description}
                            </Typography>
                        ))}
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Key Performance Indicators</Typography>
                        <Typography variant="body1">Revenue: ${kpis?.revenue}</Typography>
                        <Typography variant="body1">Customer Satisfaction: {kpis?.customerSatisfaction}%</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material'; // Using Material UI for styling
import { fetchUserStats, fetchRecentActivity, fetchKPIs } from '../api/dashboardApi'; // Placeholder API calls

interface UserStats {
    activeUsers: number;
    newUsers: number;
    churnRate: number;
}

interface Activity {
    timestamp: string;
    description: string;
}

interface KPIs {
    revenue: number;
    customerSatisfaction: number;
}

const DashboardUI = () => {
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<Activity[] | null>(null);
    const [kpis, setKpis] = useState<KPIs | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userStatsData = await fetchUserStats();
                setUserStats(userStatsData);

                const recentActivityData = await fetchRecentActivity();
                setRecentActivity(recentActivityData);

                const kpisData = await fetchKPIs();
                setKpis(kpisData);

                setLoading(false);
            } catch (err: any) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data. Please try again later.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <Alert severity="error">{error}</Alert>
        );
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">User Statistics</Typography>
                        <Typography variant="body1">Active Users: {userStats?.activeUsers}</Typography>
                        <Typography variant="body1">New Users: {userStats?.newUsers}</Typography>
                        <Typography variant="body1">Churn Rate: {userStats?.churnRate}%</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Recent Activity</Typography>
                        {recentActivity?.map((activity, index) => (
                            <Typography key={index} variant="body2">
                                {activity.timestamp}: {activity.description}
                            </Typography>
                        ))}
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Key Performance Indicators</Typography>
                        <Typography variant="body1">Revenue: ${kpis?.revenue}</Typography>
                        <Typography variant="body1">Customer Satisfaction: {kpis?.customerSatisfaction}%</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default DashboardUI;