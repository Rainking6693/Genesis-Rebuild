import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface DashboardProps {
  title: string;
  content: string;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  lastVisit: Date;
  churnProbability: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ title, content }) => {
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCustomerData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<ApiResponse<CustomerData[]>> = await axios.get<
        ApiResponse<CustomerData[]>
      >('/api/customers');
      setCustomerData(response.data.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'Error fetching customer data'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner" aria-live="polite">
          Loading...
        </div>
      ) : (
        <table aria-label="Customer Data">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Last Visit</th>
              <th>Churn Probability</th>
            </tr>
          </thead>
          <tbody>
            {customerData.length > 0 ? (
              customerData.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.lastVisit.toLocaleDateString()}</td>
                  <td>{customer.churnProbability.toFixed(2)}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="no-data">
                  No customer data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface DashboardProps {
  title: string;
  content: string;
}

interface CustomerData {
  id: string;
  name: string;
  email: string;
  lastVisit: Date;
  churnProbability: number;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ title, content }) => {
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCustomerData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<ApiResponse<CustomerData[]>> = await axios.get<
        ApiResponse<CustomerData[]>
      >('/api/customers');
      setCustomerData(response.data.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'Error fetching customer data'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner" aria-live="polite">
          Loading...
        </div>
      ) : (
        <table aria-label="Customer Data">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Last Visit</th>
              <th>Churn Probability</th>
            </tr>
          </thead>
          <tbody>
            {customerData.length > 0 ? (
              customerData.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.lastVisit.toLocaleDateString()}</td>
                  <td>{customer.churnProbability.toFixed(2)}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="no-data">
                  No customer data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;