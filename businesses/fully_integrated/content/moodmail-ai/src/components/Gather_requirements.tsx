import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface MoodMailProps {
  customerEmail: string;
  customerName: string;
}

interface EmailContent {
  title: string;
  content: string;
}

interface FetchEmailContentResponse {
  data: EmailContent;
  error: string | null;
}

const MoodMail: React.FC<MoodMailProps> = ({ customerEmail, customerName }) => {
  const [emailContent, setEmailContent] = useState<EmailContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchEmailContent = useCallback(async (): Promise<FetchEmailContentResponse> => {
    setLoading(true);
    try {
      const response: AxiosResponse<EmailContent> = await axios.get<EmailContent>(
        `/api/moodmail/${customerEmail}`
      );
      setEmailContent(response.data);
      setError(null);
      return { data: response.data, error: null };
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        axiosError.response?.data?.message || 'An error occurred while fetching the email content.';
      setError(errorMessage);
      setEmailContent(null);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [customerEmail]);

  useEffect(() => {
    void fetchEmailContent();
  }, [fetchEmailContent]);

  return (
    <div>
      {loading && (
        <div role="status" aria-live="polite">
          <p>Loading...</p>
        </div>
      )}
      {emailContent && (
        <>
          <h1>{emailContent.title}</h1>
          <p>{emailContent.content}</p>
        </>
      )}
      {error && (
        <div role="alert" aria-live="assertive">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default MoodMail;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface MoodMailProps {
  customerEmail: string;
  customerName: string;
}

interface EmailContent {
  title: string;
  content: string;
}

interface FetchEmailContentResponse {
  data: EmailContent;
  error: string | null;
}

const MoodMail: React.FC<MoodMailProps> = ({ customerEmail, customerName }) => {
  const [emailContent, setEmailContent] = useState<EmailContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchEmailContent = useCallback(async (): Promise<FetchEmailContentResponse> => {
    setLoading(true);
    try {
      const response: AxiosResponse<EmailContent> = await axios.get<EmailContent>(
        `/api/moodmail/${customerEmail}`
      );
      setEmailContent(response.data);
      setError(null);
      return { data: response.data, error: null };
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        axiosError.response?.data?.message || 'An error occurred while fetching the email content.';
      setError(errorMessage);
      setEmailContent(null);
      return { data: null, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [customerEmail]);

  useEffect(() => {
    void fetchEmailContent();
  }, [fetchEmailContent]);

  return (
    <div>
      {loading && (
        <div role="status" aria-live="polite">
          <p>Loading...</p>
        </div>
      )}
      {emailContent && (
        <>
          <h1>{emailContent.title}</h1>
          <p>{emailContent.content}</p>
        </>
      )}
      {error && (
        <div role="alert" aria-live="assertive">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default MoodMail;