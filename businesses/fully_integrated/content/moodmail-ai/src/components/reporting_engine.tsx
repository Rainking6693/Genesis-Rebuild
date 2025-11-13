import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface ReportingEngineProps {
  userId: string;
}

interface ReportData {
  title: string;
  content: string;
}

interface FetchReportDataResponse {
  data: ReportData | null;
  error: string | null;
  isLoading: boolean;
}

const ReportingEngine: React.FC<ReportingEngineProps> = ({ userId }) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchReportData = useCallback(async (): Promise<FetchReportDataResponse> => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<ReportData> = await axios.get(`/api/reports/${userId}`);
      return { data: response.data, error: null, isLoading: false };
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'An error occurred while fetching the report data.';
      return { data: null, error: errorMessage, isLoading: false };
    }
  }, [userId]);

  useEffect(() => {
    const fetchAndUpdateReportData = async () => {
      const { data, error, isLoading } = await fetchReportData();
      setReportData(data);
      setError(error);
      setIsLoading(isLoading);
    };

    fetchAndUpdateReportData();
  }, [fetchReportData]);

  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        <h2>Error</h2>
        <p>{error}</p>
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
    </div>
  );
};

export default ReportingEngine;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface ReportingEngineProps {
  userId: string;
}

interface ReportData {
  title: string;
  content: string;
}

interface FetchReportDataResponse {
  data: ReportData | null;
  error: string | null;
  isLoading: boolean;
}

const ReportingEngine: React.FC<ReportingEngineProps> = ({ userId }) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchReportData = useCallback(async (): Promise<FetchReportDataResponse> => {
    setIsLoading(true);
    try {
      const response: AxiosResponse<ReportData> = await axios.get(`/api/reports/${userId}`);
      return { data: response.data, error: null, isLoading: false };
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'An error occurred while fetching the report data.';
      return { data: null, error: errorMessage, isLoading: false };
    }
  }, [userId]);

  useEffect(() => {
    const fetchAndUpdateReportData = async () => {
      const { data, error, isLoading } = await fetchReportData();
      setReportData(data);
      setError(error);
      setIsLoading(isLoading);
    };

    fetchAndUpdateReportData();
  }, [fetchReportData]);

  if (isLoading) {
    return (
      <div role="status" aria-live="polite">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" aria-live="assertive">
        <h2>Error</h2>
        <p>{error}</p>
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
    </div>
  );
};

export default ReportingEngine;