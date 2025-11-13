// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface KPIProps {
  label: string;
  value: number;
}

const KPI: React.FC<KPIProps> = ({ label, value }) => {
  return (
    <div className="kpi">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );
};

interface ChartProps {
  data: { x: string; y: number }[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  // Placeholder for chart rendering logic (e.g., using Chart.js)
  return (
    <div className="chart">
      {/* Chart rendering will go here */}
      <p>Chart Placeholder</p>
    </div>
  );
};

function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

const DashboardUI: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        const mockData = {
          kpis: [
            { label: 'Users', value: 1234 },
            { label: 'Revenue', value: 5678 },
          ],
          chartData: [{ x: 'Jan', y: 10 }, { x: 'Feb', y: 20 }],
        };
        setData(mockData);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return (
      <ErrorFallback error={error} reset={() => {
        setError(null);
        setLoading(true);
        setData(null);
      }} />
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app so that it can recover
        setError(null);
        setLoading(true);
        setData(null);
      }}
    >
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="kpi-container">
          {data.kpis.map((kpi: any) => (
            <KPI key={kpi.label} label={kpi.label} value={kpi.value} />
          ))}
        </div>
        <div className="chart-container">
          <Chart data={data.chartData} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface KPIProps {
  label: string;
  value: number;
}

const KPI: React.FC<KPIProps> = ({ label, value }) => {
  return (
    <div className="kpi">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );
};

interface ChartProps {
  data: { x: string; y: number }[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  // Placeholder for chart rendering logic (e.g., using Chart.js)
  return (
    <div className="chart">
      {/* Chart rendering will go here */}
      <p>Chart Placeholder</p>
    </div>
  );
};

function ErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
      <button onClick={reset}>Try again</button>
    </div>
  );
}

const DashboardUI: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        const mockData = {
          kpis: [
            { label: 'Users', value: 1234 },
            { label: 'Revenue', value: 5678 },
          ],
          chartData: [{ x: 'Jan', y: 10 }, { x: 'Feb', y: 20 }],
        };
        setData(mockData);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return (
      <ErrorFallback error={error} reset={() => {
        setError(null);
        setLoading(true);
        setData(null);
      }} />
    );
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app so that it can recover
        setError(null);
        setLoading(true);
        setData(null);
      }}
    >
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="kpi-container">
          {data.kpis.map((kpi: any) => (
            <KPI key={kpi.label} label={kpi.label} value={kpi.value} />
          ))}
        </div>
        <div className="chart-container">
          <Chart data={data.chartData} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;