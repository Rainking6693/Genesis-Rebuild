import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface EmailProps {
  id: string;
  subject: string;
  content: string;
  sentimentScore: number;
  sendTime: Date;
}

const MoodMailAI: React.FC = () => {
  const [emails, setEmails] = useState<EmailProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const emailsRef = useRef<EmailProps[]>([]);

  const fetchEmails = useCallback(async () => {
    try {
      const response: AxiosResponse<EmailProps[]> = await axios.get<EmailProps[]>('/api/emails');
      setEmails(response.data);
      emailsRef.current = response.data;
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(`Error fetching emails: ${axiosError.message}`);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const adjustEmailTone = (email: EmailProps): EmailProps => {
    let adjustedContent = email.content;
    if (email.sentimentScore < 0) {
      adjustedContent = adjustedContent.replace(/\b(sad|upset|angry)\b/gi, 'happy');
    } else if (email.sentimentScore > 0) {
      adjustedContent = adjustedContent.replace(/\b(happy|excited|joyful)\b/gi, 'calm');
    }
    return { ...email, content: adjustedContent };
  };

  const adjustEmailTiming = (email: EmailProps): EmailProps => {
    const currentTime = new Date();
    const timeDiff = currentTime.getTime() - email.sendTime.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    if (hoursDiff < 8 && email.sentimentScore < 0) {
      return { ...email, sendTime: new Date(email.sendTime.getTime() + 8 * 60 * 60 * 1000) };
    }
    return email;
  };

  const sendEmails = () => {
    emailsRef.current.forEach((email) => {
      const adjustedEmail = adjustEmailTone(adjustEmailTiming(email));
      // Send the adjusted email
      console.log('Sending email:', adjustedEmail);
    });
  };

  return (
    <div>
      <h1>MoodMail AI</h1>
      {error && (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      <button onClick={sendEmails} disabled={emails.length === 0}>
        Send Emails
      </button>
    </div>
  );
};

export default MoodMailAI;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';

interface EmailProps {
  id: string;
  subject: string;
  content: string;
  sentimentScore: number;
  sendTime: Date;
}

const MoodMailAI: React.FC = () => {
  const [emails, setEmails] = useState<EmailProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const emailsRef = useRef<EmailProps[]>([]);

  const fetchEmails = useCallback(async () => {
    try {
      const response: AxiosResponse<EmailProps[]> = await axios.get<EmailProps[]>('/api/emails');
      setEmails(response.data);
      emailsRef.current = response.data;
      setError(null);
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(`Error fetching emails: ${axiosError.message}`);
    }
  }, []);

  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  const adjustEmailTone = (email: EmailProps): EmailProps => {
    let adjustedContent = email.content;
    if (email.sentimentScore < 0) {
      adjustedContent = adjustedContent.replace(/\b(sad|upset|angry)\b/gi, 'happy');
    } else if (email.sentimentScore > 0) {
      adjustedContent = adjustedContent.replace(/\b(happy|excited|joyful)\b/gi, 'calm');
    }
    return { ...email, content: adjustedContent };
  };

  const adjustEmailTiming = (email: EmailProps): EmailProps => {
    const currentTime = new Date();
    const timeDiff = currentTime.getTime() - email.sendTime.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    if (hoursDiff < 8 && email.sentimentScore < 0) {
      return { ...email, sendTime: new Date(email.sendTime.getTime() + 8 * 60 * 60 * 1000) };
    }
    return email;
  };

  const sendEmails = () => {
    emailsRef.current.forEach((email) => {
      const adjustedEmail = adjustEmailTone(adjustEmailTiming(email));
      // Send the adjusted email
      console.log('Sending email:', adjustedEmail);
    });
  };

  return (
    <div>
      <h1>MoodMail AI</h1>
      {error && (
        <div role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      <button onClick={sendEmails} disabled={emails.length === 0}>
        Send Emails
      </button>
    </div>
  );
};

export default MoodMailAI;