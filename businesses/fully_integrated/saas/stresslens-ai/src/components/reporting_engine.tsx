import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface ReportingEngineProps {
  teamId: string;
}

interface ReportData {
  title: string;
  content: string;
  insights: string[];
  recommendations: string[];
}

interface FetchReportDataResponse {
  data: ReportData;
  error: string | null;
  isLoading: boolean;
}

const ReportingEngine: React.FC<ReportingEngineProps> = ({ teamId }) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [fetchReportDataResponse, setFetchReportDataResponse] =
    useState<FetchReportDataResponse>({
      data: null,
      error: null,
      isLoading: false,
    });
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchReportData = useCallback(async () => {
    try {
      setFetchReportDataResponse((prevState) => ({
        ...prevState,
        isLoading: true,
        error: null,
      }));

      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<ReportData> = await axios.get<ReportData>(
        `/api/reports/${teamId}`,
        { signal }
      );
      setFetchReportDataResponse({
        data: response.data,
        error: null,
        isLoading: false,
      });
      setReportData(response.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled');
      } else {
        const axiosError = err as AxiosError;
        setFetchReportDataResponse({
          data: null,
          error:
            axiosError.response?.data?.message ||
            axiosError.message ||
            'An error occurred while fetching the report data.',
          isLoading: false,
        });
      }
    }
  }, [teamId]);

  useEffect(() => {
    fetchReportData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchReportData]);

  if (fetchReportDataResponse.isLoading) {
    return (
      <div aria-live="polite" aria-label="Loading report data">
        Loading...
      </div>
    );
  }

  if (fetchReportDataResponse.error) {
    return (
      <div aria-live="polite" role="alert">
        <h2>Error</h2>
        <p>{fetchReportDataResponse.error}</p>
        <button onClick={fetchReportData}>Retry</button>
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
      <h2>Recommendations:</h2>
      <ul>
        {reportData.recommendations.map((recommendation, index) => (
          <li key={index}>{recommendation}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReportingEngine;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface ReportingEngineProps {
  teamId: string;
}

interface ReportData {
  title: string;
  content: string;
  insights: string[];
  recommendations: string[];
}

interface FetchReportDataResponse {
  data: ReportData;
  error: string | null;
  isLoading: boolean;
}

const ReportingEngine: React.FC<ReportingEngineProps> = ({ teamId }) => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [fetchReportDataResponse, setFetchReportDataResponse] =
    useState<FetchReportDataResponse>({
      data: null,
      error: null,
      isLoading: false,
    });
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchReportData = useCallback(async () => {
    try {
      setFetchReportDataResponse((prevState) => ({
        ...prevState,
        isLoading: true,
        error: null,
      }));

      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;
      const response: AxiosResponse<ReportData> = await axios.get<ReportData>(
        `/api/reports/${teamId}`,
        { signal }
      );
      setFetchReportDataResponse({
        data: response.data,
        error: null,
        isLoading: false,
      });
      setReportData(response.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled');
      } else {
        const axiosError = err as AxiosError;
        setFetchReportDataResponse({
          data: null,
          error:
            axiosError.response?.data?.message ||
            axiosError.message ||
            'An error occurred while fetching the report data.',
          isLoading: false,
        });
      }
    }
  }, [teamId]);

  useEffect(() => {
    fetchReportData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchReportData]);

  if (fetchReportDataResponse.isLoading) {
    return (
      <div aria-live="polite" aria-label="Loading report data">
        Loading...
      </div>
    );
  }

  if (fetchReportDataResponse.error) {
    return (
      <div aria-live="polite" role="alert">
        <h2>Error</h2>
        <p>{fetchReportDataResponse.error}</p>
        <button onClick={fetchReportData}>Retry</button>
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
      <h2>Recommendations:</h2>
      <ul>
        {reportData.recommendations.map((recommendation, index) => (
          <li key={index}>{recommendation}</li>
        ))}
      </ul>
    </div>
  );
};

export default ReportingEngine;