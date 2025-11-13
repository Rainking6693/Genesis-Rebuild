import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface Report {
  id: string;
  name: string;
  description: string;
}

interface ReportingEngineProps {
  title: string;
  description: string;
}

const ReportingEngine: React.FC<ReportingEngineProps> = ({ title, description }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<Report[]> = await axios.get<Report[]>('/api/reports');
      setReports(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An error occurred while fetching reports.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <table aria-label="Reports">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Description</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.name}</td>
                <td>{report.description}</td>
                <td>
                  <a href={`/api/reports/${report.id}/download`}>Download</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReportingEngine;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface Report {
  id: string;
  name: string;
  description: string;
}

interface ReportingEngineProps {
  title: string;
  description: string;
}

const ReportingEngine: React.FC<ReportingEngineProps> = ({ title, description }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<Report[]> = await axios.get<Report[]>('/api/reports');
      setReports(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An error occurred while fetching reports.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <table aria-label="Reports">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Description</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.name}</td>
                <td>{report.description}</td>
                <td>
                  <a href={`/api/reports/${report.id}/download`}>Download</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReportingEngine;