// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  error?: string;
}

const DashboardContainer = styled.div`
  padding: 20px;
  font-family: sans-serif;
`;

const DataCard = styled.div`
  background-color: #f0f0f0;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const ErrorMessage = styled.div`
  color: red;
  font-weight: bold;
`;

function DashboardUI() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    users: 0,
    activeUsers: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        const data = await new Promise<DashboardData>((resolve, reject) => {
          setTimeout(() => {
            // Simulate an error sometimes
            if (Math.random() < 0.2) {
              reject(new Error("Failed to fetch data"));
            } else {
              resolve({ users: 123, activeUsers: 45, revenue: 1000 });
            }
          }, 500);
        });

        setDashboardData(data);
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData({ ...dashboardData, error: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <DashboardContainer>Loading...</DashboardContainer>;
  }

  if (dashboardData.error) {
    return (
      <DashboardContainer>
        <ErrorMessage>Error: {dashboardData.error}</ErrorMessage>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <h1>Dashboard</h1>
      <DataCard>Total Users: {dashboardData.users}</DataCard>
      <DataCard>Active Users: {dashboardData.activeUsers}</DataCard>
      <DataCard>Revenue: ${dashboardData.revenue}</DataCard>
    </DashboardContainer>
  );
}

export default DashboardUI;

// Error Boundary Component (Simple Example)
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error("Caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Usage Example: Wrap DashboardUI with ErrorBoundary in App.tsx
// <ErrorBoundary>
//   <DashboardUI />
// </ErrorBoundary>