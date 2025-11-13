// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardApi'; // Assuming an API endpoint
import { ErrorBoundary } from './ErrorBoundary'; // Reusable error boundary component
import { LoadingSpinner } from './LoadingSpinner'; // Reusable loading spinner component
import { Card, CardContent, Typography, Grid } from '@mui/material'; // Using Material UI for styling

interface DashboardData {
  userCount: number;
  activeUsers: number;
  monthlyRevenue: number;
  recentActivity: string[];
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
        console.error("Error fetching dashboard data:", err); // Log the error for debugging
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading Dashboard Data..." />;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <Typography variant="h6" color="error">
          Error: {error.message}
        </Typography>
      </ErrorBoundary>
    );
  }

  if (!dashboardData) {
    return <Typography>No data available.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{dashboardData.userCount}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Active Users</Typography>
            <Typography variant="h4">{dashboardData.activeUsers}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Monthly Revenue</Typography>
            <Typography variant="h4">${dashboardData.monthlyRevenue}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Recent Activity</Typography>
            <ul>
              {dashboardData.recentActivity.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { fetchDashboardData } from '../api/dashboardApi'; // Assuming an API endpoint
import { ErrorBoundary } from './ErrorBoundary'; // Reusable error boundary component
import { LoadingSpinner } from './LoadingSpinner'; // Reusable loading spinner component
import { Card, CardContent, Typography, Grid } from '@mui/material'; // Using Material UI for styling

interface DashboardData {
  userCount: number;
  activeUsers: number;
  monthlyRevenue: number;
  recentActivity: string[];
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardData();
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
        console.error("Error fetching dashboard data:", err); // Log the error for debugging
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading Dashboard Data..." />;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <Typography variant="h6" color="error">
          Error: {error.message}
        </Typography>
      </ErrorBoundary>
    );
  }

  if (!dashboardData) {
    return <Typography>No data available.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{dashboardData.userCount}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Active Users</Typography>
            <Typography variant="h4">{dashboardData.activeUsers}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Monthly Revenue</Typography>
            <Typography variant="h4">${dashboardData.monthlyRevenue}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">Recent Activity</Typography>
            <ul>
              {dashboardData.recentActivity.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardUI;