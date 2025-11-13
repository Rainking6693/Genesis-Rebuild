import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface EmployeeData {
  name: string;
  email: string;
  burnoutLevel: number;
  wellnessScore: number;
}

interface DashboardProps {
  companyName: string;
  description: string;
}

const MindFlowDashboard: React.FC<DashboardProps> = ({ companyName, description }) => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmployeeData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<EmployeeData[]> = await axios.get('/api/employees');
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || axiosError.message || 'An error occurred while fetching employee data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchEmployeeData().catch((error) => {
      if (error.name !== 'AbortError') {
        setError('An error occurred while fetching employee data.');
      }
    });

    return () => {
      abortController.abort();
    };
  }, [fetchEmployeeData]);

  return (
    <div>
      <header>
        <h1>{companyName}</h1>
        <p>{description}</p>
      </header>
      <main>
        <h2>Employee Wellness Dashboard</h2>
        {error && (
          <div role="alert" aria-live="assertive" className="error-message">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="loading-spinner" aria-live="assertive">
            Loading...
          </div>
        ) : (
          <table aria-label="Employee Wellness Dashboard">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Burnout Level</th>
                <th>Wellness Score</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.email}>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.burnoutLevel}</td>
                    <td>{employee.wellnessScore}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="no-data">
                    No employee data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default MindFlowDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface EmployeeData {
  name: string;
  email: string;
  burnoutLevel: number;
  wellnessScore: number;
}

interface DashboardProps {
  companyName: string;
  description: string;
}

const MindFlowDashboard: React.FC<DashboardProps> = ({ companyName, description }) => {
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmployeeData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<EmployeeData[]> = await axios.get('/api/employees');
      setEmployees(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || axiosError.message || 'An error occurred while fetching employee data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchEmployeeData().catch((error) => {
      if (error.name !== 'AbortError') {
        setError('An error occurred while fetching employee data.');
      }
    });

    return () => {
      abortController.abort();
    };
  }, [fetchEmployeeData]);

  return (
    <div>
      <header>
        <h1>{companyName}</h1>
        <p>{description}</p>
      </header>
      <main>
        <h2>Employee Wellness Dashboard</h2>
        {error && (
          <div role="alert" aria-live="assertive" className="error-message">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="loading-spinner" aria-live="assertive">
            Loading...
          </div>
        ) : (
          <table aria-label="Employee Wellness Dashboard">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Burnout Level</th>
                <th>Wellness Score</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.email}>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.burnoutLevel}</td>
                    <td>{employee.wellnessScore}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="no-data">
                    No employee data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default MindFlowDashboard;