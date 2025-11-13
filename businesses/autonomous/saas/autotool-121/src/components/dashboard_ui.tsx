// src/components/DashboardUI.tsx
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by error boundary", error, errorInfo);
    this.setState({errorInfo: errorInfo});
  }

  render() {
    if (this.state.hasError) {
      // You could render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

interface DashboardData {
    keyMetrics: {
        totalUsers: number;
        activeUsers: number;
        revenue: number;
    };
    chartData: {
        labels: string[];
        data: number[];
    };
    tableData: {
        header: string[];
        rows: string[][];
    };
}

const DashboardUI = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate fetching data from an API
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

                const mockData: DashboardData = {
                    keyMetrics: {
                        totalUsers: 1000,
                        activeUsers: 750,
                        revenue: 50000
                    },
                    chartData: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                        data: [10, 20, 15, 25, 30]
                    },
                    tableData: {
                        header: ['Name', 'Email', 'Status'],
                        rows: [
                            ['John Doe', 'john.doe@example.com', 'Active'],
                            ['Jane Smith', 'jane.smith@example.com', 'Inactive'],
                            ['Peter Jones', 'peter.jones@example.com', 'Active']
                        ]
                    }
                };

                setDashboardData(mockData);
                setLoading(false);
            } catch (e: any) {
                setError(e.message || 'An error occurred while fetching data.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading dashboard data...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!dashboardData) {
        return <div>No data available.</div>;
    }

    return (
        <ErrorBoundary>
            <div>
                <h1>Dashboard</h1>

                <div>
                    <h2>Key Metrics</h2>
                    <p>Total Users: {dashboardData.keyMetrics.totalUsers}</p>
                    <p>Active Users: {dashboardData.keyMetrics.activeUsers}</p>
                    <p>Revenue: ${dashboardData.keyMetrics.revenue}</p>
                </div>

                <div>
                    <h2>Chart</h2>
                    {/* Placeholder for chart component */}
                    <p>Chart Data: {JSON.stringify(dashboardData.chartData)}</p>
                </div>

                <div>
                    <h2>Table</h2>
                    <table>
                        <thead>
                            <tr>
                                {dashboardData.tableData.header.map(header => (
                                    <th key={header}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.tableData.rows.map((row, index) => (
                                <tr key={index}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
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
import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by error boundary", error, errorInfo);
    this.setState({errorInfo: errorInfo});
  }

  render() {
    if (this.state.hasError) {
      // You could render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

interface DashboardData {
    keyMetrics: {
        totalUsers: number;
        activeUsers: number;
        revenue: number;
    };
    chartData: {
        labels: string[];
        data: number[];
    };
    tableData: {
        header: string[];
        rows: string[][];
    };
}

const DashboardUI = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate fetching data from an API
                setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency

                const mockData: DashboardData = {
                    keyMetrics: {
                        totalUsers: 1000,
                        activeUsers: 750,
                        revenue: 50000
                    },
                    chartData: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                        data: [10, 20, 15, 25, 30]
                    },
                    tableData: {
                        header: ['Name', 'Email', 'Status'],
                        rows: [
                            ['John Doe', 'john.doe@example.com', 'Active'],
                            ['Jane Smith', 'jane.smith@example.com', 'Inactive'],
                            ['Peter Jones', 'peter.jones@example.com', 'Active']
                        ]
                    }
                };

                setDashboardData(mockData);
                setLoading(false);
            } catch (e: any) {
                setError(e.message || 'An error occurred while fetching data.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading dashboard data...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!dashboardData) {
        return <div>No data available.</div>;
    }

    return (
        <ErrorBoundary>
            <div>
                <h1>Dashboard</h1>

                <div>
                    <h2>Key Metrics</h2>
                    <p>Total Users: {dashboardData.keyMetrics.totalUsers}</p>
                    <p>Active Users: {dashboardData.keyMetrics.activeUsers}</p>
                    <p>Revenue: ${dashboardData.keyMetrics.revenue}</p>
                </div>

                <div>
                    <h2>Chart</h2>
                    {/* Placeholder for chart component */}
                    <p>Chart Data: {JSON.stringify(dashboardData.chartData)}</p>
                </div>

                <div>
                    <h2>Table</h2>
                    <table>
                        <thead>
                            <tr>
                                {dashboardData.tableData.header.map(header => (
                                    <th key={header}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData.tableData.rows.map((row, index) => (
                                <tr key={index}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
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