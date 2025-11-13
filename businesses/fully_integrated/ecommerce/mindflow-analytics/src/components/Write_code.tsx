import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface EmployeeData {
  name: string;
  email: string;
  burnoutLevel: number;
  wellnessScore: number;
}

interface DashboardProps {
  title: string;
  apiEndpoint?: string; // Make API endpoint configurable
}

const Dashboard: React.FC<DashboardProps> = ({ title, apiEndpoint = '/api/employees' }) => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback to memoize the fetch function, preventing unnecessary re-renders
  const fetchEmployeeData = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const response: AxiosResponse<EmployeeData[]> = await axios.get<EmployeeData[]>(apiEndpoint, {
        timeout: 5000, // Add a timeout to prevent indefinite loading
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid employee data received from the server.');
      }

      setEmployees(response.data);
    } catch (e) {
      let errorMessage = 'Failed to fetch employee data.';
      if (e instanceof AxiosError) {
        if (e.response) {
          errorMessage = `Failed to fetch employee data. Server responded with status: ${e.response.status} - ${e.response.statusText}`;
        } else if (e.request) {
          errorMessage = 'Failed to fetch employee data. No response received from the server.';
        } else {
          errorMessage = `Failed to fetch employee data. Error setting up the request: ${e.message}`;
        }
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }
      console.error('Error fetching employee data:', e);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  // Handle loading and error states gracefully
  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <p>Loading employee data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert">
        <p>Error: {error}</p>
        <button onClick={fetchEmployeeData}>Retry</button>
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div role="region" aria-live="polite">
        <p>No employee data available.</p>
      </div>
    );
  }

  return (
    <div role="region" aria-live="polite">
      <h1 id="dashboard-title">{title}</h1>
      <table aria-labelledby="dashboard-title">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Burnout Level</th>
            <th scope="col">Wellness Score</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.email}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.burnoutLevel}</td>
              <td>{employee.wellnessScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface EmployeeData {
  name: string;
  email: string;
  burnoutLevel: number;
  wellnessScore: number;
}

interface DashboardProps {
  title: string;
  apiEndpoint?: string; // Make API endpoint configurable
}

const Dashboard: React.FC<DashboardProps> = ({ title, apiEndpoint = '/api/employees' }) => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback to memoize the fetch function, preventing unnecessary re-renders
  const fetchEmployeeData = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const response: AxiosResponse<EmployeeData[]> = await axios.get<EmployeeData[]>(apiEndpoint, {
        timeout: 5000, // Add a timeout to prevent indefinite loading
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid employee data received from the server.');
      }

      setEmployees(response.data);
    } catch (e) {
      let errorMessage = 'Failed to fetch employee data.';
      if (e instanceof AxiosError) {
        if (e.response) {
          errorMessage = `Failed to fetch employee data. Server responded with status: ${e.response.status} - ${e.response.statusText}`;
        } else if (e.request) {
          errorMessage = 'Failed to fetch employee data. No response received from the server.';
        } else {
          errorMessage = `Failed to fetch employee data. Error setting up the request: ${e.message}`;
        }
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }
      console.error('Error fetching employee data:', e);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint]);

  useEffect(() => {
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  // Handle loading and error states gracefully
  if (loading) {
    return (
      <div role="status" aria-live="polite">
        <p>Loading employee data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert">
        <p>Error: {error}</p>
        <button onClick={fetchEmployeeData}>Retry</button>
      </div>
    );
  }

  if (!employees || employees.length === 0) {
    return (
      <div role="region" aria-live="polite">
        <p>No employee data available.</p>
      </div>
    );
  }

  return (
    <div role="region" aria-live="polite">
      <h1 id="dashboard-title">{title}</h1>
      <table aria-labelledby="dashboard-title">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Burnout Level</th>
            <th scope="col">Wellness Score</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.email}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.burnoutLevel}</td>
              <td>{employee.wellnessScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;