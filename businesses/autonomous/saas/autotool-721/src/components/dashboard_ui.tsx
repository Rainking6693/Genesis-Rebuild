// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary'; // Assuming you have an ErrorBoundary component
import KPI from './KPI'; // Placeholder for KPI component
import Chart from './Chart'; // Placeholder for Chart component
import Table from './Table'; // Placeholder for Table component
import { fetchData } from '../api'; // Placeholder for API call

interface DashboardData {
  kpis: { [key: string]: number };
  chartData: any; // Replace 'any' with a more specific type
  tableData: any[]; // Replace 'any' with a more specific type
}

const DashboardUI = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchData('/api/dashboard'); // Replace with your actual API endpoint
        setData(dashboardData);
        setLoading(false);
      } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
        setError(err);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div>Error loading dashboard: {error.message}</div>
      </ErrorBoundary>
    );
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {Object.entries(data.kpis).map(([key, value]) => (
            <KPI key={key} label={key} value={value} />
          ))}
        </div>
        <Chart data={data.chartData} />
        <Table data={data.tableData} />
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary'; // Assuming you have an ErrorBoundary component
import KPI from './KPI'; // Placeholder for KPI component
import Chart from './Chart'; // Placeholder for Chart component
import Table from './Table'; // Placeholder for Table component
import { fetchData } from '../api'; // Placeholder for API call

interface DashboardData {
  kpis: { [key: string]: number };
  chartData: any; // Replace 'any' with a more specific type
  tableData: any[]; // Replace 'any' with a more specific type
}

const DashboardUI = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchData('/api/dashboard'); // Replace with your actual API endpoint
        setData(dashboardData);
        setLoading(false);
      } catch (err: any) { // Explicitly type 'err' as 'any' or 'Error'
        setError(err);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div>Error loading dashboard: {error.message}</div>
      </ErrorBoundary>
    );
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {Object.entries(data.kpis).map(([key, value]) => (
            <KPI key={key} label={key} value={value} />
          ))}
        </div>
        <Chart data={data.chartData} />
        <Table data={data.tableData} />
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;