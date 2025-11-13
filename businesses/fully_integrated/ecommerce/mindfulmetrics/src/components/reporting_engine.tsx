import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface ReportingEngineProps {
  teamId: string;
}

interface ReportData {
  title: string;
  content: string;
  burnoutRisk: number;
}

interface ErrorState {
  message: string;
  code?: number;
}

const ReportingEngine: React.FC<ReportingEngineProps> = ({ teamId }) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReportData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<ReportData> = await axios.get(`/api/reports/${teamId}`);
      setReportData(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError({
        message:
          axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred while fetching the report data.',
        code: axiosError.response?.status,
      });
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  return (
    <div>
      {isLoading && (
        <div role="status" aria-live="polite" aria-atomic="true">
          Loading...
        </div>
      )}
      {error && (
        <div role="alert" aria-live="assertive" aria-atomic="true">
          {error.message} (Error code: {error.code})
        </div>
      )}
      {reportData && (
        <div>
          <h1>{reportData.title}</h1>
          <p>{reportData.content}</p>
          <p>Burnout Risk: {reportData.burnoutRisk}%</p>
        </div>
      )}
    </div>
  );
};

export default ReportingEngine;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface ReportingEngineProps {
  teamId: string;
}

interface ReportData {
  title: string;
  content: string;
  burnoutRisk: number;
}

interface ErrorState {
  message: string;
  code?: number;
}

const ReportingEngine: React.FC<ReportingEngineProps> = ({ teamId }) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReportData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<ReportData> = await axios.get(`/api/reports/${teamId}`);
      setReportData(response.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError({
        message:
          axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred while fetching the report data.',
        code: axiosError.response?.status,
      });
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  return (
    <div>
      {isLoading && (
        <div role="status" aria-live="polite" aria-atomic="true">
          Loading...
        </div>
      )}
      {error && (
        <div role="alert" aria-live="assertive" aria-atomic="true">
          {error.message} (Error code: {error.code})
        </div>
      )}
      {reportData && (
        <div>
          <h1>{reportData.title}</h1>
          <p>{reportData.content}</p>
          <p>Burnout Risk: {reportData.burnoutRisk}%</p>
        </div>
      )}
    </div>
  );
};

export default ReportingEngine;