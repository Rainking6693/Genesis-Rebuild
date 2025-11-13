// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material'; // Using Material UI for styling
import { fetchData } from '../utils/api'; // Placeholder for API call

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  chartData: {
    labels: string[];
    data: number[];
  };
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with actual API endpoint
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    loadData();
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
      <div style={{ color: 'red', textAlign: 'center' }}>
        <Typography variant="h6">{error}</Typography>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h6">No data available.</Typography>
      </div>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{dashboardData.users}</Typography>
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
            <Typography variant="h6">Revenue</Typography>
            <Typography variant="h4">${dashboardData.revenue}</Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* Placeholder for Chart Component */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">User Activity</Typography>
            {/*  <Chart data={dashboardData.chartData} /> */}
            <div>Chart Component Placeholder</div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material'; // Using Material UI for styling
import { fetchData } from '../utils/api'; // Placeholder for API call

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  chartData: {
    labels: string[];
    data: number[];
  };
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData<DashboardData>('/api/dashboard'); // Replace with actual API endpoint
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    loadData();
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
      <div style={{ color: 'red', textAlign: 'center' }}>
        <Typography variant="h6">{error}</Typography>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Typography variant="h6">No data available.</Typography>
      </div>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{dashboardData.users}</Typography>
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
            <Typography variant="h6">Revenue</Typography>
            <Typography variant="h4">${dashboardData.revenue}</Typography>
          </CardContent>
        </Card>
      </Grid>
      {/* Placeholder for Chart Component */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6">User Activity</Typography>
            {/*  <Chart data={dashboardData.chartData} /> */}
            <div>Chart Component Placeholder</div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardUI;