// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
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
  margin-top: 10px;
`;

const LoadingMessage = styled.div`
  color: blue;
  margin-top: 10px;
`;

function DashboardUI() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingMessage>Loading dashboard data...</LoadingMessage>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <ErrorMessage>Error: {error}</ErrorMessage>
      </DashboardContainer>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardContainer>
        <ErrorMessage>No data available.</ErrorMessage>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <h1>Dashboard</h1>
      <DataCard>Users: {dashboardData.users}</DataCard>
      <DataCard>Active Users: {dashboardData.activeUsers}</DataCard>
      <DataCard>Revenue: ${dashboardData.revenue}</DataCard>
      <DataCard>Churn Rate: {dashboardData.churnRate}%</DataCard>
    </DashboardContainer>
  );
}

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  churnRate: number;
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
  margin-top: 10px;
`;

const LoadingMessage = styled.div`
  color: blue;
  margin-top: 10px;
`;

function DashboardUI() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DashboardData = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingMessage>Loading dashboard data...</LoadingMessage>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <ErrorMessage>Error: {error}</ErrorMessage>
      </DashboardContainer>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardContainer>
        <ErrorMessage>No data available.</ErrorMessage>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <h1>Dashboard</h1>
      <DataCard>Users: {dashboardData.users}</DataCard>
      <DataCard>Active Users: {dashboardData.activeUsers}</DataCard>
      <DataCard>Revenue: ${dashboardData.revenue}</DataCard>
      <DataCard>Churn Rate: {dashboardData.churnRate}%</DataCard>
    </DashboardContainer>
  );
}

export default DashboardUI;