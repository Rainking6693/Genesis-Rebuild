// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface KPI {
  label: string;
  value: number;
  trend: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

const DashboardUI = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

        const mockKpis: KPI[] = [
          { label: 'Users', value: 1234, trend: 5 },
          { label: 'Revenue', value: 5678, trend: -2 },
          { label: 'Sessions', value: 9012, trend: 10 },
        ];

        const mockChartData: ChartData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            {
              label: 'Sales',
              data: [65, 59, 80, 81, 56],
              backgroundColor: 'rgba(75,192,192,0.2)',
            },
          ],
        };

        setKpis(mockKpis);
        setChartData(mockChartData);
        setLoading(false);
      } catch (e: any) {
        console.error("Error fetching data:", e);
        setError(e.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="kpi-container">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi">
            <h2>{kpi.label}</h2>
            <p>{kpi.value}</p>
            <p>Trend: {kpi.trend}%</p>
          </div>
        ))}
      </div>

      {chartData && (
        <div className="chart-container">
          {/* Placeholder for chart component (e.g., using Chart.js) */}
          <h3>Sales Chart</h3>
          <p>Chart data will be rendered here.</p>
          <pre>{JSON.stringify(chartData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const ErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre style={{color: 'red'}}>{error.message}</pre>
    <button onClick={reset}>Try again</button>
  </div>
);

const WrappedDashboardUI = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => console.error("ErrorBoundary caught an error", error, info)}
  >
    <DashboardUI />
  </ErrorBoundary>
);

export default WrappedDashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface KPI {
  label: string;
  value: number;
  trend: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

const DashboardUI = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

        const mockKpis: KPI[] = [
          { label: 'Users', value: 1234, trend: 5 },
          { label: 'Revenue', value: 5678, trend: -2 },
          { label: 'Sessions', value: 9012, trend: 10 },
        ];

        const mockChartData: ChartData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
          datasets: [
            {
              label: 'Sales',
              data: [65, 59, 80, 81, 56],
              backgroundColor: 'rgba(75,192,192,0.2)',
            },
          ],
        };

        setKpis(mockKpis);
        setChartData(mockChartData);
        setLoading(false);
      } catch (e: any) {
        console.error("Error fetching data:", e);
        setError(e.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="kpi-container">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="kpi">
            <h2>{kpi.label}</h2>
            <p>{kpi.value}</p>
            <p>Trend: {kpi.trend}%</p>
          </div>
        ))}
      </div>

      {chartData && (
        <div className="chart-container">
          {/* Placeholder for chart component (e.g., using Chart.js) */}
          <h3>Sales Chart</h3>
          <p>Chart data will be rendered here.</p>
          <pre>{JSON.stringify(chartData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

const ErrorFallback = ({ error, reset }: { error: Error; reset: () => void }) => (
  <div role="alert">
    <p>Something went wrong:</p>
    <pre style={{color: 'red'}}>{error.message}</pre>
    <button onClick={reset}>Try again</button>
  </div>
);

const WrappedDashboardUI = () => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error, info) => console.error("ErrorBoundary caught an error", error, info)}
  >
    <DashboardUI />
  </ErrorBoundary>
);

export default WrappedDashboardUI;