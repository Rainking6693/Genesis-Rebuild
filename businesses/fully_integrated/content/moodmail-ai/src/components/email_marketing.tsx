import React, { useState, useEffect } from 'react';
import { sendEmail, analyzeCustomerSentiment } from './api';

interface EmailProps {
  title: string;
  content: string;
  customerData: {
    name: string;
    email: string;
    sentimentScore: number;
  };
}

const EmailComponent: React.FC<EmailProps> = ({ title, content, customerData }) => {
  const [emailTone, setEmailTone] = useState<'empathetic' | 'uplifting' | 'neutral'>('neutral');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const adjustEmailTone = async () => {
      try {
        const sentimentScore = await analyzeCustomerSentiment(customerData.email);
        setEmailTone(getSentimentTone(sentimentScore));
      } catch (err) {
        console.error('Error analyzing customer sentiment:', err);
        setEmailTone('neutral');
      }
    };
    adjustEmailTone();
  }, [customerData.email]);

  const getSentimentTone = (score: number): 'empathetic' | 'uplifting' | 'neutral' => {
    if (score < 3) return 'empathetic';
    if (score > 7) return 'uplifting';
    return 'neutral';
  };

  const sendEmailWithAdjustedTone = async () => {
    try {
      setIsSending(true);
      setError(null);
      await sendEmail({
        to: customerData.email,
        from: 'support@moodmail.com',
        subject: `[${emailTone.toUpperCase()}] ${title}`,
        body: `Dear ${customerData.name},\n\n${content}\n\nBest regards,\nMoodMail Team`
      });
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Failed to send email. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <button
        onClick={sendEmailWithAdjustedTone}
        disabled={isSending}
        aria-label={isSending ? 'Sending email...' : 'Send email'}
      >
        {isSending ? 'Sending...' : 'Send Email'}
      </button>
      {error && <div role="alert">{error}</div>}
    </div>
  );
};

export default EmailComponent;

import React, { useState, useEffect } from 'react';
import { sendEmail, analyzeCustomerSentiment } from './api';

interface EmailProps {
  title: string;
  content: string;
  customerData: {
    name: string;
    email: string;
    sentimentScore: number;
  };
}

const EmailComponent: React.FC<EmailProps> = ({ title, content, customerData }) => {
  const [emailTone, setEmailTone] = useState<'empathetic' | 'uplifting' | 'neutral'>('neutral');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const adjustEmailTone = async () => {
      try {
        const sentimentScore = await analyzeCustomerSentiment(customerData.email);
        setEmailTone(getSentimentTone(sentimentScore));
      } catch (err) {
        console.error('Error analyzing customer sentiment:', err);
        setEmailTone('neutral');
      }
    };
    adjustEmailTone();
  }, [customerData.email]);

  const getSentimentTone = (score: number): 'empathetic' | 'uplifting' | 'neutral' => {
    if (score < 3) return 'empathetic';
    if (score > 7) return 'uplifting';
    return 'neutral';
  };

  const sendEmailWithAdjustedTone = async () => {
    try {
      setIsSending(true);
      setError(null);
      await sendEmail({
        to: customerData.email,
        from: 'support@moodmail.com',
        subject: `[${emailTone.toUpperCase()}] ${title}`,
        body: `Dear ${customerData.name},\n\n${content}\n\nBest regards,\nMoodMail Team`
      });
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Failed to send email. Please try again later.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <h1>{title}</h1>
      <p>{content}</p>
      <button
        onClick={sendEmailWithAdjustedTone}
        disabled={isSending}
        aria-label={isSending ? 'Sending email...' : 'Send email'}
      >
        {isSending ? 'Sending...' : 'Send Email'}
      </button>
      {error && <div role="alert">{error}</div>}
    </div>
  );
};

export default EmailComponent;