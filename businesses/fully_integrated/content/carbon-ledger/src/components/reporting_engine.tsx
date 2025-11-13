import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SustainabilityReport {
  title: string;
  content: string;
  createdAt: string;
}

const ReportingEngine: React.FC = () => {
  const [reports, setReports] = useState<SustainabilityReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<SustainabilityReport[]> = await axios.get('/api/reports');
      setReports(response.data);
      setError(null);
    } catch (err) {
      const error = err as AxiosError;
      setError(`Error fetching reports: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div>
      <h1>Sustainability Reports</h1>
      {isLoading && <div>Loading...</div>}
      {error && (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      )}
      {reports.length === 0 && !isLoading && !error && (
        <div>No reports available.</div>
      )}
      {reports.map((report) => (
        <div key={report.createdAt}>
          <h2>{report.title}</h2>
          <p>{report.content}</p>
          <p>Created at: {report.createdAt}</p>
        </div>
      ))}
    </div>
  );
};

export default ReportingEngine;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface SustainabilityReport {
  title: string;
  content: string;
  createdAt: string;
}

const ReportingEngine: React.FC = () => {
  const [reports, setReports] = useState<SustainabilityReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<SustainabilityReport[]> = await axios.get('/api/reports');
      setReports(response.data);
      setError(null);
    } catch (err) {
      const error = err as AxiosError;
      setError(`Error fetching reports: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return (
    <div>
      <h1>Sustainability Reports</h1>
      {isLoading && <div>Loading...</div>}
      {error && (
        <div role="alert" aria-live="assertive" className="error">
          {error}
        </div>
      )}
      {reports.length === 0 && !isLoading && !error && (
        <div>No reports available.</div>
      )}
      {reports.map((report) => (
        <div key={report.createdAt}>
          <h2>{report.title}</h2>
          <p>{report.content}</p>
          <p>Created at: {report.createdAt}</p>
        </div>
      ))}
    </div>
  );
};

export default ReportingEngine;