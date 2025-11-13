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
  apiEndpoint?: string; // Allow customization of the API endpoint
}

const ReportingEngine: React.FC<ReportingEngineProps> = ({
  title,
  description,
  apiEndpoint = '/api/reports',
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    // Create a new AbortController instance to cancel the request if needed
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response: AxiosResponse<Report[]> = await axios.get<Report[]>(apiEndpoint, {
        signal: abortController.signal,
      });
      setReports(response.data);
    } catch (e) {
      if (axios.isCancel(e)) {
        // Request was cancelled, do nothing
        return;
      }

      let errorMessage = 'Failed to fetch reports. Please try again later.';
      if (axios.isAxiosError(e)) {
        const axiosError = e as AxiosError;
        errorMessage = axiosError.message;
        if (axiosError.response) {
          errorMessage = `Failed to fetch reports. Status: ${axiosError.response.status}, Message: ${
            axiosError.response.data?.message || 'Unknown error'
          }`;
        }
      } else if (e instanceof Error) {
        errorMessage = `An unexpected error occurred: ${e.message}`;
      }

      setError(errorMessage);
      console.error('Error fetching reports:', e);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [apiEndpoint]);

  useEffect(() => {
    fetchReports();

    // Clean up the AbortController when the component is unmounted
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchReports]);

  const handleDownloadClick = (reportId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent default navigation
    event.preventDefault();

    // Construct the download URL
    const downloadUrl = `/api/reports/${reportId}/download`;

    // Open the download URL in a new tab/window
    window.open(downloadUrl, '_blank');

    // Optional: Log the download event
    console.log(`Downloading report with ID: ${reportId}`);
  };

  if (loading) {
    return (
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        <p>Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        <p role="alert" style={{ color: 'red' }}>
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {reports.length > 0 ? (
        <table>
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
                  <a
                    href={`/api/reports/${report.id}/download`}
                    onClick={handleDownloadClick(report.id)}
                    aria-label={`Download report ${report.name}`}
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reports available.</p>
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
  apiEndpoint?: string; // Allow customization of the API endpoint
}

const ReportingEngine: React.FC<ReportingEngineProps> = ({
  title,
  description,
  apiEndpoint = '/api/reports',
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    // Create a new AbortController instance to cancel the request if needed
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response: AxiosResponse<Report[]> = await axios.get<Report[]>(apiEndpoint, {
        signal: abortController.signal,
      });
      setReports(response.data);
    } catch (e) {
      if (axios.isCancel(e)) {
        // Request was cancelled, do nothing
        return;
      }

      let errorMessage = 'Failed to fetch reports. Please try again later.';
      if (axios.isAxiosError(e)) {
        const axiosError = e as AxiosError;
        errorMessage = axiosError.message;
        if (axiosError.response) {
          errorMessage = `Failed to fetch reports. Status: ${axiosError.response.status}, Message: ${
            axiosError.response.data?.message || 'Unknown error'
          }`;
        }
      } else if (e instanceof Error) {
        errorMessage = `An unexpected error occurred: ${e.message}`;
      }

      setError(errorMessage);
      console.error('Error fetching reports:', e);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, [apiEndpoint]);

  useEffect(() => {
    fetchReports();

    // Clean up the AbortController when the component is unmounted
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchReports]);

  const handleDownloadClick = (reportId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent default navigation
    event.preventDefault();

    // Construct the download URL
    const downloadUrl = `/api/reports/${reportId}/download`;

    // Open the download URL in a new tab/window
    window.open(downloadUrl, '_blank');

    // Optional: Log the download event
    console.log(`Downloading report with ID: ${reportId}`);
  };

  if (loading) {
    return (
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        <p>Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
        <p role="alert" style={{ color: 'red' }}>
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {reports.length > 0 ? (
        <table>
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
                  <a
                    href={`/api/reports/${report.id}/download`}
                    onClick={handleDownloadClick(report.id)}
                    aria-label={`Download report ${report.name}`}
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reports available.</p>
      )}
    </div>
  );
};

export default ReportingEngine;