// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';

// Styled Components for better UI
const StyledCard = styled(Card)({
  marginBottom: '20px',
  boxShadow: '0px 3px 5px rgba(0,0,0,0.2)',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const StyledCardContent = styled(CardContent)({
  padding: '20px',
});

const LoadingContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '200px',
});

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  // Add more data types as needed
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency
        const data: DashboardData = {
          users: 1234,
          activeUsers: 567,
          revenue: 123456,
        };
        setDashboardData(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <Typography color="error">
        Error: {error}
      </Typography>
    );
  }

  if (!dashboardData) {
    return <Typography>No data available.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <StyledCard>
          <StyledCardContent>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{dashboardData.users}</Typography>
          </StyledCardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StyledCard>
          <StyledCardContent>
            <Typography variant="h6">Active Users</Typography>
            <Typography variant="h4">{dashboardData.activeUsers}</Typography>
          </StyledCardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StyledCard>
          <StyledCardContent>
            <Typography variant="h6">Revenue</Typography>
            <Typography variant="h4">${dashboardData.revenue}</Typography>
          </StyledCardContent>
        </StyledCard>
      </Grid>

      {/* Placeholder for Charts and Tables */}
      <Grid item xs={12}>
        <StyledCard>
          <StyledCardContent>
            <Typography variant="h6">User Growth Chart (Placeholder)</Typography>
            {/* Replace with actual chart component */}
          </StyledCardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12}>
        <StyledCard>
          <StyledCardContent>
            <Typography variant="h6">Recent Activity Table (Placeholder)</Typography>
            {/* Replace with actual table component */}
          </StyledCardContent>
        </StyledCard>
      </Grid>
    </Grid>
  );
};

export default DashboardUI;