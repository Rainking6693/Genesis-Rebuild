// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  kpis: { [key: string]: number };
  chartData: any[]; // Replace 'any' with a more specific type
  tableData: any[]; // Replace 'any' with a more specific type
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        setLoading(true);
        const response = await new Promise<DashboardData>((resolve) => {
          setTimeout(() => {
            resolve({
              kpis: {
                'Active Users': 1234,
                'Monthly Revenue': 56789,
                'Conversion Rate': 0.05,
              },
              chartData: [{ x: 'A', y: 10 }, { x: 'B', y: 20 }, { x: 'C', y: 15 }],
              tableData: [{ id: 1, name: 'Item 1', value: 100 }, { id: 2, name: 'Item 2', value: 200 }],
            });
          }, 1000); // Simulate API latency
        });

        setDashboardData(response);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error loading dashboard: {error.message}
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No data available.</div>; // Handle the case where data is still null after loading
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong with the dashboard UI.</div>}>
      <div>
        <h1>Dashboard</h1>

        {/* KPI Section */}
        <div>
          <h2>Key Performance Indicators</h2>
          {Object.entries(dashboardData.kpis).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div>
          <h2>Chart</h2>
          {/* Placeholder for a chart component (e.g., using Chart.js or similar) */}
          <p>Chart Placeholder</p>
        </div>

        {/* Table Section */}
        <div>
          <h2>Table</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.tableData.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  kpis: { [key: string]: number };
  chartData: any[]; // Replace 'any' with a more specific type
  tableData: any[]; // Replace 'any' with a more specific type
}

const DashboardUI: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate fetching data from an API
        setLoading(true);
        const response = await new Promise<DashboardData>((resolve) => {
          setTimeout(() => {
            resolve({
              kpis: {
                'Active Users': 1234,
                'Monthly Revenue': 56789,
                'Conversion Rate': 0.05,
              },
              chartData: [{ x: 'A', y: 10 }, { x: 'B', y: 20 }, { x: 'C', y: 15 }],
              tableData: [{ id: 1, name: 'Item 1', value: 100 }, { id: 2, name: 'Item 2', value: 200 }],
            });
          }, 1000); // Simulate API latency
        });

        setDashboardData(response);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error loading dashboard: {error.message}
      </div>
    );
  }

  if (!dashboardData) {
    return <div>No data available.</div>; // Handle the case where data is still null after loading
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong with the dashboard UI.</div>}>
      <div>
        <h1>Dashboard</h1>

        {/* KPI Section */}
        <div>
          <h2>Key Performance Indicators</h2>
          {Object.entries(dashboardData.kpis).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div>
          <h2>Chart</h2>
          {/* Placeholder for a chart component (e.g., using Chart.js or similar) */}
          <p>Chart Placeholder</p>
        </div>

        {/* Table Section */}
        <div>
          <h2>Table</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.tableData.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;