// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Placeholder components (replace with actual implementations)
const SummaryCard = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
`;

const ChartContainer = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
`;

const TableContainer = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
`;

interface DashboardData {
  summaryData: { [key: string]: any };
  chartData: any[];
  tableData: any[];
}

interface DashboardUIProps {
  fetchData: () => Promise<DashboardData>;
}

const DashboardUI: React.FC<DashboardUIProps> = ({ fetchData }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchData();
        setData(dashboardData);
        setLoading(false);
      } catch (e: any) {
        setError(e);
        setLoading(false);
      }
    };

    loadData();
  }, [fetchData]);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading dashboard: {error.message}
        <details>
          <summary>Stack Trace</summary>
          <pre>{error.stack}</pre>
        </details>
      </div>
    );
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <section>
        <h2>Summary</h2>
        {Object.entries(data.summaryData).map(([key, value]) => (
          <SummaryCard key={key}>
            <strong>{key}:</strong> {value}
          </SummaryCard>
        ))}
      </section>

      <section>
        <h2>Charts</h2>
        <ChartContainer>
          {/* Placeholder for chart component */}
          Chart Data: {JSON.stringify(data.chartData)}
        </ChartContainer>
      </section>

      <section>
        <h2>Table</h2>
        <TableContainer>
          {/* Placeholder for table component */}
          Table Data: {JSON.stringify(data.tableData)}
        </TableContainer>
      </section>
    </div>
  );
};

export default DashboardUI;

// src/components/DashboardUI.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Placeholder components (replace with actual implementations)
const SummaryCard = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
`;

const ChartContainer = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
`;

const TableContainer = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  margin: 10px;
`;

interface DashboardData {
  summaryData: { [key: string]: any };
  chartData: any[];
  tableData: any[];
}

interface DashboardUIProps {
  fetchData: () => Promise<DashboardData>;
}

const DashboardUI: React.FC<DashboardUIProps> = ({ fetchData }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardData = await fetchData();
        setData(dashboardData);
        setLoading(false);
      } catch (e: any) {
        setError(e);
        setLoading(false);
      }
    };

    loadData();
  }, [fetchData]);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div>
        Error loading dashboard: {error.message}
        <details>
          <summary>Stack Trace</summary>
          <pre>{error.stack}</pre>
        </details>
      </div>
    );
  }

  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <section>
        <h2>Summary</h2>
        {Object.entries(data.summaryData).map(([key, value]) => (
          <SummaryCard key={key}>
            <strong>{key}:</strong> {value}
          </SummaryCard>
        ))}
      </section>

      <section>
        <h2>Charts</h2>
        <ChartContainer>
          {/* Placeholder for chart component */}
          Chart Data: {JSON.stringify(data.chartData)}
        </ChartContainer>
      </section>

      <section>
        <h2>Table</h2>
        <TableContainer>
          {/* Placeholder for table component */}
          Table Data: {JSON.stringify(data.tableData)}
        </TableContainer>
      </section>
    </div>
  );
};

export default DashboardUI;