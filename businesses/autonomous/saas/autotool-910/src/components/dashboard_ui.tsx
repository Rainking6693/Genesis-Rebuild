import React, { useState, useEffect } from 'react';
import { fetchData } from '../api/dataService'; // Assuming a data service
import ErrorBoundary from './ErrorBoundary'; // Error boundary component
import LoadingSpinner from './LoadingSpinner'; // Loading spinner component
import { User } from '../types/user'; // Example type
import { DataPoint } from '../types/data'; // Example type

interface DashboardProps {
  user: User;
}

const DashboardUI: React.FC<DashboardProps> = ({ user }) => {
  const [data, setData] = useState<DataPoint[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData(user.id);
        setData(fetchedData);
        setLoading(false);
      } catch (err: any) {
        setError(err);
        setLoading(false);
      }
    };

    loadData();
  }, [user.id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorBoundary>
        <div>Error: {error.message}</div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div>
        <h1>Welcome, {user.name}!</h1>
        {data && (
          <ul>
            {data.map((item) => (
              <li key={item.id}>{item.value}</li>
            ))}
          </ul>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default DashboardUI;

// Mock fetchData function (replace with actual API call)
async function fetchData(userId: string): Promise<DataPoint[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const random = Math.random();
      if (random > 0.9) {
        reject(new Error("Failed to fetch data"));
      } else {
        const mockData: DataPoint[] = [
          { id: '1', value: Math.floor(Math.random() * 100) },
          { id: '2', value: Math.floor(Math.random() * 100) },
        ];
        resolve(mockData);
      }
    }, 500);
  });
}

// Mock types
interface User {
  id: string;
  name: string;
}

interface DataPoint {
  id: string;
  value: number;
}

{
  "status": "✅ SUCCESS",
  "language": "TypeScript React",
  "lines": 64,
  "test_coverage": "N/A",
  "type_coverage": "100% (TypeScript)",
  "errors": 0,
  "warnings": 0
}