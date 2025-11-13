// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled Components for better UI
const StyledCard = styled(Card)({
  marginBottom: '20px',
  boxShadow: '0px 3px 5px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

const StyledCardContent = styled(CardContent)({
  padding: '20px',
});

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  // Add more data fields as needed
}

interface Props {
  // Define any props the component might receive
}

interface State {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean, error: Error | null, errorInfo: ErrorInfo | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error in ErrorBoundary", error, errorInfo);
    this.setState({errorInfo: errorInfo});
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Alert severity="error">Something went wrong. Please try again later. Error: {this.state.error?.message} </Alert>;
    }

    return this.props.children;
  }
}

const DashboardUI: React.FC<Props> = () => {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        const response = await new Promise<DashboardData>((resolve, reject) => {
          setTimeout(() => {
            // Simulate success or failure
            const success = Math.random() > 0.1; // Simulate a 10% chance of failure
            if (success) {
              resolve({
                totalUsers: 1234,
                activeUsers: 876,
                monthlyRevenue: 56789,
              });
            } else {
              reject(new Error('Failed to fetch dashboard data.'));
            }
          }, 1500); // Simulate a 1.5 second delay
        });

        setState({ ...state, data: response, loading: false, error: null });
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setState({ ...state, loading: false, error: error.message || 'An unexpected error occurred.' });
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  if (state.loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (state.error) {
    return <Alert severity="error">{state.error}</Alert>;
  }

  return (
    <ErrorBoundary>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <StyledCard>
          <StyledCardContent>
            <Typography variant="h6" component="div">
              Total Users
            </Typography>
            <Typography variant="h4">{state.data?.totalUsers}</Typography>
          </StyledCardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StyledCard>
          <StyledCardContent>
            <Typography variant="h6" component="div">
              Active Users
            </Typography>
            <Typography variant="h4">{state.data?.activeUsers}</Typography>
          </StyledCardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StyledCard>
          <StyledCardContent>
            <Typography variant="h6" component="div">
              Monthly Revenue
            </Typography>
            <Typography variant="h4">${state.data?.monthlyRevenue}</Typography>
          </StyledCardContent>
        </StyledCard>
      </Grid>
      {/* Add more metrics and components as needed */}
    </Grid>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled Components for better UI
const StyledCard = styled(Card)({
  marginBottom: '20px',
  boxShadow: '0px 3px 5px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

const StyledCardContent = styled(CardContent)({
  padding: '20px',
});

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  monthlyRevenue: number;
  // Add more data fields as needed
}

interface Props {
  // Define any props the component might receive
}

interface State {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean, error: Error | null, errorInfo: ErrorInfo | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error in ErrorBoundary", error, errorInfo);
    this.setState({errorInfo: errorInfo});
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <Alert severity="error">Something went wrong. Please try again later. Error: {this.state.error?.message} </Alert>;
    }

    return this.props.children;
  }
}

const DashboardUI: React.FC<Props> = () => {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        const response = await new Promise<DashboardData>((resolve, reject) => {
          setTimeout(() => {
            // Simulate success or failure
            const success = Math.random() > 0.1; // Simulate a 10% chance of failure
            if (success) {
              resolve({
                totalUsers: 1234,
                activeUsers: 876,
                monthlyRevenue: 56789,
              });
            } else {
              reject(new Error('Failed to fetch dashboard data.'));
            }
          }, 1500); // Simulate a 1.5 second delay
        });

        setState({ ...state, data: response, loading: false, error: null });
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setState({ ...state, loading: false, error: error.message || 'An unexpected error occurred.' });
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  if (state.loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (state.error) {
    return <Alert severity="error">{state.error}</Alert>;
  }

  return (
    <ErrorBoundary>
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={4}>
        <StyledCard>
          <StyledCardContent>
            <Typography variant="h6" component="div">
              Total Users
            </Typography>
            <Typography variant="h4">{state.data?.totalUsers}</Typography>
          </StyledCardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StyledCard>
          <StyledCardContent>
            <Typography variant="h6" component="div">
              Active Users
            </Typography>
            <Typography variant="h4">{state.data?.activeUsers}</Typography>
          </StyledCardContent>
        </StyledCard>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <StyledCard>
          <StyledCardContent>
            <Typography variant="h6" component="div">
              Monthly Revenue
            </Typography>
            <Typography variant="h4">${state.data?.monthlyRevenue}</Typography>
          </StyledCardContent>
        </StyledCard>
      </Grid>
      {/* Add more metrics and components as needed */}
    </Grid>
    </ErrorBoundary>
  );
};

export default DashboardUI;

**Build Report:**