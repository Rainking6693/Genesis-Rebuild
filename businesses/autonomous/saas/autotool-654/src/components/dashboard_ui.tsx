// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material'; // Using Material UI for a clean look

interface DashboardData {
  userCount: number;
  activeUsers: number;
  monthlyRevenue: number;
  recentActivity: string[];
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        setLoading(true);
        const response = await new Promise<DashboardData>((resolve) =>
          setTimeout(() => {
            resolve({
              userCount: 1234,
              activeUsers: 456,
              monthlyRevenue: 7890,
              recentActivity: [
                'User A signed up',
                'User B updated profile',
                'User C made a purchase',
              ],
            });
          }, 1000) // Simulate network latency
        );

        setDashboardData(response);
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

  if (!dashboardData) {
    return <div>No data available.</div>;
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
import { Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material'; // Using Material UI for a clean look

interface DashboardData {
  userCount: number;
  activeUsers: number;
  monthlyRevenue: number;
  recentActivity: string[];
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        setLoading(true);
        const response = await new Promise<DashboardData>((resolve) =>
          setTimeout(() => {
            resolve({
              userCount: 1234,
              activeUsers: 456,
              monthlyRevenue: 7890,
              recentActivity: [
                'User A signed up',
                'User B updated profile',
                'User C made a purchase',
              ],
            });
          }, 1000) // Simulate network latency
        );

        setDashboardData(response);
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

  if (!dashboardData) {
    return <div>No data available.</div>;
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