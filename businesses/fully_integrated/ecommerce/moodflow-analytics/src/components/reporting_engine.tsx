import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface ReportingEngineProps {
  teamId: string;
}

interface ReportData {
  title: string;
  content: string;
  insights: string[];
}

interface ApiResponse {
  data: ReportData;
  message?: string;
}

const ReportingEngine: React.FC<ReportingEngineProps> = ({ teamId }) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchReportData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<ApiResponse> = await axios.get(`/api/reports/${teamId}`);
      setReportData(response.data.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred while fetching the report data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleRetry = () => {
    fetchReportData();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  if (!reportData) {
    return null;
  }

  return (
    <div>
      <h1>{reportData.title}</h1>
      <p>{reportData.content}</p>
      <h2>Insights:</h2>
      <ul>
        {reportData.insights.map((insight, index) => (
          <li key={index}>{insight}</li>
        ))}
      </ul>
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
  insights: string[];
}

interface ApiResponse {
  data: ReportData;
  message?: string;
}

const ReportingEngine: React.FC<ReportingEngineProps> = ({ teamId }) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchReportData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response: AxiosResponse<ApiResponse> = await axios.get(`/api/reports/${teamId}`);
      setReportData(response.data.data);
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred while fetching the report data.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleRetry = () => {
    fetchReportData();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  if (!reportData) {
    return null;
  }

  return (
    <div>
      <h1>{reportData.title}</h1>
      <p>{reportData.content}</p>
      <h2>Insights:</h2>
      <ul>
        {reportData.insights.map((insight, index) => (
          <li key={index}>{insight}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReportingEngine;