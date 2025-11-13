import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();
      const response = await axios.get<Report[]>('/api/reports', {
        signal: abortControllerRef.current.signal,
      });
      setReports(response.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled');
      } else {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message || 'An error occurred while fetching reports.'
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchReports();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchReports]);

  const handleDownload = async (reportId: string) => {
    try {
      const response: AxiosResponse<Blob> = await axios.get(`/api/reports/${reportId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An error occurred while downloading the report.'
      );
    }
  };

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
        <div className="loading-spinner" aria-live="polite">
          Loading reports...
        </div>
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
                  <button onClick={() => handleDownload(report.id)}>Download</button>
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

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      abortControllerRef.current = new AbortController();
      const response = await axios.get<Report[]>('/api/reports', {
        signal: abortControllerRef.current.signal,
      });
      setReports(response.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled');
      } else {
        const axiosError = err as AxiosError;
        setError(
          axiosError.response?.data?.message || 'An error occurred while fetching reports.'
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchReports();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchReports]);

  const handleDownload = async (reportId: string) => {
    try {
      const response: AxiosResponse<Blob> = await axios.get(`/api/reports/${reportId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message || 'An error occurred while downloading the report.'
      );
    }
  };

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
        <div className="loading-spinner" aria-live="polite">
          Loading reports...
        </div>
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
                  <button onClick={() => handleDownload(report.id)}>Download</button>
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