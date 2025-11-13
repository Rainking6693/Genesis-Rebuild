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
}

const Dashboard: React.FC<DashboardProps> = ({ title }) => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmployeeData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<EmployeeData[]> = await axios.get<EmployeeData[]>('/api/employees');
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An error occurred while fetching employee data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        await fetchEmployeeData();
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch request aborted');
        } else {
          throw err;
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [fetchEmployeeData]);

  return (
    <div>
      <h1>{title}</h1>
      {isLoading ? (
        <div role="status" aria-live="polite">
          Loading employee data...
        </div>
      ) : error ? (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      ) : (
        <table aria-label="Employee Data" aria-describedby="employee-data-table-description">
          <caption id="employee-data-table-description">
            This table displays the name, email, burnout level, and wellness score of all employees.
          </caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Burnout Level</th>
              <th>Wellness Score</th>
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
      )}
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
}

const Dashboard: React.FC<DashboardProps> = ({ title }) => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmployeeData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<EmployeeData[]> = await axios.get<EmployeeData[]>('/api/employees');
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An error occurred while fetching employee data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      try {
        await fetchEmployeeData();
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          console.log('Fetch request aborted');
        } else {
          throw err;
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [fetchEmployeeData]);

  return (
    <div>
      <h1>{title}</h1>
      {isLoading ? (
        <div role="status" aria-live="polite">
          Loading employee data...
        </div>
      ) : error ? (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      ) : (
        <table aria-label="Employee Data" aria-describedby="employee-data-table-description">
          <caption id="employee-data-table-description">
            This table displays the name, email, burnout level, and wellness score of all employees.
          </caption>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Burnout Level</th>
              <th>Wellness Score</th>
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
      )}
    </div>
  );
};

export default Dashboard;