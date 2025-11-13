// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { Grid, Paper, Typography, CircularProgress, Alert } from '@mui/material'; // Using Material UI
import { styled } from '@mui/material/styles';

interface DashboardData {
  activeUsers: number;
  monthlyRevenue: number;
  churnRate: number;
}

interface Props {
  children?: ReactNode;
}

// Error Boundary Component
class ErrorBoundary extends React.Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Alert severity="error">Something went wrong. Please try again later.</Alert>;
    }

    return this.props.children;
  }
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function DashboardUI() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        setLoading(true);
        const response = await new Promise<DashboardData>((resolve, reject) => {
          setTimeout(() => {
            const success = Math.random() > 0.1; // Simulate occasional failure
            if (success) {
              resolve({
                activeUsers: Math.floor(Math.random() * 1000),
                monthlyRevenue: Math.floor(Math.random() * 100000),
                churnRate: Math.random() * 0.1,
              });
            } else {
              reject(new Error("Failed to fetch dashboard data"));
            }
          }, 1000);
        });

        setDashboardData(response);
      } catch (e: any) {
        setError(e.message);
      } finally {
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
      <Alert severity="error">Error: {error}</Alert>
    );
  }

  return (
    <ErrorBoundary>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <Typography variant="h6">Active Users</Typography>
            <Typography variant="body1">{dashboardData?.activeUsers}</Typography>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <Typography variant="h6">Monthly Revenue</Typography>
            <Typography variant="body1">${dashboardData?.monthlyRevenue}</Typography>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <Typography variant="h6">Churn Rate</Typography>
            <Typography variant="body1">{(dashboardData?.churnRate * 100).toFixed(2)}%</Typography>
          </Item>
        </Grid>
      </Grid>
    </ErrorBoundary>
  );
}