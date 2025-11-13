import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface EmailProps {
  title: string;
  content: string;
  sentiment: number;
  timingAdjustment: number;
}

interface FetchEmailsResponse {
  data: EmailProps[];
  error: string | null;
}

const MoodMailAI: React.FC = () => {
  const [emails, setEmails] = useState<EmailProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async (): Promise<FetchEmailsResponse> => {
    try {
      const response: AxiosResponse<EmailProps[]> = await axios.get<EmailProps[]>('/api/emails');
      return { data: response.data, error: null };
    } catch (err) {
      const axiosError = err as AxiosError;
      return { data: [], error: `Error fetching emails: ${axiosError.message}` };
    }
  }, []);

  useEffect(() => {
    const fetchAndSetEmails = async () => {
      const { data, error } = await fetchEmails();
      setEmails(data);
      setError(error);
    };
    fetchAndSetEmails();
  }, [fetchEmails]);

  const adjustEmailContent = (email: EmailProps): string => {
    const { sentiment, timingAdjustment } = email;
    let adjustedContent = email.content;

    // Adjust email content based on sentiment and timing
    if (sentiment < 0) {
      adjustedContent = adjustedContent.replace(/negative/g, 'positive');
    }
    if (timingAdjustment > 0) {
      adjustedContent = adjustedContent.replace(/now/g, 'later');
    }

    return adjustedContent;
  };

  return (
    <div>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {emails.map((email, index) => (
        <div key={index} className="email-container">
          <h1 className="email-title">{email.title}</h1>
          <p className="email-content">{adjustEmailContent(email)}</p>
        </div>
      ))}
    </div>
  );
};

export default MoodMailAI;

import React, { useState, useEffect, useCallback } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface EmailProps {
  title: string;
  content: string;
  sentiment: number;
  timingAdjustment: number;
}

interface FetchEmailsResponse {
  data: EmailProps[];
  error: string | null;
}

const MoodMailAI: React.FC = () => {
  const [emails, setEmails] = useState<EmailProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = useCallback(async (): Promise<FetchEmailsResponse> => {
    try {
      const response: AxiosResponse<EmailProps[]> = await axios.get<EmailProps[]>('/api/emails');
      return { data: response.data, error: null };
    } catch (err) {
      const axiosError = err as AxiosError;
      return { data: [], error: `Error fetching emails: ${axiosError.message}` };
    }
  }, []);

  useEffect(() => {
    const fetchAndSetEmails = async () => {
      const { data, error } = await fetchEmails();
      setEmails(data);
      setError(error);
    };
    fetchAndSetEmails();
  }, [fetchEmails]);

  const adjustEmailContent = (email: EmailProps): string => {
    const { sentiment, timingAdjustment } = email;
    let adjustedContent = email.content;

    // Adjust email content based on sentiment and timing
    if (sentiment < 0) {
      adjustedContent = adjustedContent.replace(/negative/g, 'positive');
    }
    if (timingAdjustment > 0) {
      adjustedContent = adjustedContent.replace(/now/g, 'later');
    }

    return adjustedContent;
  };

  return (
    <div>
      {error && (
        <div role="alert" aria-live="assertive" className="error-message">
          {error}
        </div>
      )}
      {emails.map((email, index) => (
        <div key={index} className="email-container">
          <h1 className="email-title">{email.title}</h1>
          <p className="email-content">{adjustEmailContent(email)}</p>
        </div>
      ))}
    </div>
  );
};

export default MoodMailAI;