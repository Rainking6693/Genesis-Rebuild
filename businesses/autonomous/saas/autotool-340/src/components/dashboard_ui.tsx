// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import styled from 'styled-components';

// Styled Components for basic layout
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 200px;
  background-color: #f0f0f0;
  padding: 20px;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const NavItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #ddd;
  }
`;

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        const response = await new Promise<DashboardData>((resolve) =>
          setTimeout(() => {
            resolve({
              users: 1200,
              activeUsers: 800,
              revenue: 50000,
            });
          }, 1000)
        );

        setDashboardData(response);
        setLoading(false);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <DashboardContainer>
      <Sidebar>
        <NavItem onClick={() => handleNavigation('/dashboard')}>Dashboard</NavItem>
        <NavItem onClick={() => handleNavigation('/users')}>Users</NavItem>
        <NavItem onClick={() => handleNavigation('/settings')}>Settings</NavItem>
      </Sidebar>
      <Content>
        <h1>Dashboard</h1>
        {dashboardData && (
          <>
            <p>Total Users: {dashboardData.users}</p>
            <p>Active Users: {dashboardData.activeUsers}</p>
            <p>Revenue: ${dashboardData.revenue}</p>
          </>
        )}
      </Content>
    </DashboardContainer>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import styled from 'styled-components';

// Styled Components for basic layout
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 200px;
  background-color: #f0f0f0;
  padding: 20px;
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

const NavItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #ddd;
  }
`;

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
}

const DashboardUI = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        const response = await new Promise<DashboardData>((resolve) =>
          setTimeout(() => {
            resolve({
              users: 1200,
              activeUsers: 800,
              revenue: 50000,
            });
          }, 1000)
        );

        setDashboardData(response);
        setLoading(false);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <DashboardContainer>
      <Sidebar>
        <NavItem onClick={() => handleNavigation('/dashboard')}>Dashboard</NavItem>
        <NavItem onClick={() => handleNavigation('/users')}>Users</NavItem>
        <NavItem onClick={() => handleNavigation('/settings')}>Settings</NavItem>
      </Sidebar>
      <Content>
        <h1>Dashboard</h1>
        {dashboardData && (
          <>
            <p>Total Users: {dashboardData.users}</p>
            <p>Active Users: {dashboardData.activeUsers}</p>
            <p>Revenue: ${dashboardData.revenue}</p>
          </>
        )}
      </Content>
    </DashboardContainer>
  );
};

export default DashboardUI;