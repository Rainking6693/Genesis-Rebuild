// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface DashboardData {
  users: number;
  activeUsers: number;
  revenue: number;
  chartData: {
    labels: string[];
    data: number[];
  };
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
              users: 1234,
              activeUsers: 567,
              revenue: 123456,
              chartData: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                data: [10, 20, 15, 25, 30],
              },
            });
          }, 500); // Simulate network latency
        });

        setDashboardData(response);
      } catch (e: any) {
        setError(e);
      } finally {
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
      <ErrorBoundary fallback={<div>Something went wrong.</div>}>
        <div>Error: {error.message}</div>
      </ErrorBoundary>
    );
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="metrics">
        <div>Total Users: {dashboardData.users}</div>
        <div>Active Users: {dashboardData.activeUsers}</div>
        <div>Revenue: ${dashboardData.revenue}</div>
      </div>
      <div className="chart">
        {/* Placeholder for chart component */}
        <p>Chart Data: {JSON.stringify(dashboardData.chartData)}</p>
      </div>
    </div>
  );
};

export default DashboardUI;

**Explanation:**

*   **TypeScript and React:** The code is written in TypeScript and uses React for UI rendering.
*   **Error Handling:** An `ErrorBoundary` component is used to catch errors during rendering.  Loading and error states are managed to provide a better user experience.
*   **Data Fetching:**  A simulated data fetching process is included using `useEffect` and `useState`.  This includes a simulated network latency.
*   **Basic UI:** The component renders a basic dashboard layout with placeholders for metrics and a chart.
*   **Build Report:** The JSON object provides a summary of the build process.

Now, I will use the `Write` tool to save the code to `src/components/DashboardUI.tsx` and the build report to `build_report.json`.