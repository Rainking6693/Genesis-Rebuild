import React, { useState, useEffect, useCallback, useRef } from 'react';
import { sendAnalyticsEvent } from './analytics';

// Define a type for the tone adjustment value
type ToneAdjustment = -1 | 0 | 1;

interface MoodMailProps {
  title: string;
  content: string;
  customerSentiment: number;
  customerMentalHealth: number;
  // Optional error boundary fallback content
  errorFallbackContent?: React.ReactNode;
}

const MoodMail: React.FC<MoodMailProps> = ({
  title,
  content,
  customerSentiment,
  customerMentalHealth,
  errorFallbackContent = <p>Error displaying content.</p>, // Default fallback
}) => {
  const [adjustedTitle, setAdjustedTitle] = useState<string>(title);
  const [adjustedContent, setAdjustedContent] = useState<string>(content);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  // Use useCallback to memoize the analyzeTone function
  const analyzeTone = useCallback(
    (sentiment: number, mentalHealth: number): ToneAdjustment => {
      if (typeof sentiment !== 'number' || typeof mentalHealth !== 'number') {
        console.warn('Invalid sentiment or mental health value. Must be a number.');
        return 0; // Default to neutral tone
      }

      if (sentiment < 0 || sentiment > 1 || mentalHealth < 0 || mentalHealth > 1) {
        console.warn('Sentiment and mentalHealth should be between 0 and 1.');
        return 0;
      }

      if (sentiment < 0.4 || mentalHealth < 0.6) {
        return -1; // More empathetic and supportive
      } else if (sentiment > 0.7 && mentalHealth > 0.8) {
        return 1; // More upbeat and positive
      }
      return 0; // Neutral tone
    },
    []
  );

  // Use useCallback to memoize the sanitizeInput function
  const sanitizeInput = useCallback(
    (input: string, adjustedTone: ToneAdjustment): string => {
      if (typeof input !== 'string') {
        console.warn('Invalid input. Must be a string.');
        return ''; // Return an empty string to prevent crashes
      }

      let sanitizedInput = input;
      try {
        if (adjustedTone === -1) {
          sanitizedInput = sanitizedInput.replace(/!+/g, '.');
        } else if (adjustedTone === 1) {
          sanitizedInput = sanitizedInput.replace(/\.+/g, '!');
        }
      } catch (e: any) {
        console.error('Error during sanitization:', e);
        return input; // Return the original input on error
      }
      return sanitizedInput;
    },
    []
  );

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    try {
      const adjustedTone = analyzeTone(customerSentiment, customerMentalHealth);
      setAdjustedTitle(sanitizeInput(title, adjustedTone));
      setAdjustedContent(sanitizeInput(content, adjustedTone));

      sendAnalyticsEvent('email_displayed', {
        title: adjustedTitle,
        content: adjustedContent,
        customerSentiment,
        customerMentalHealth,
      });
    } catch (e: any) {
      if (isMountedRef.current) {
        console.error('Error processing MoodMail:', e);
        setError(e);
      }
    }
  }, [title, content, customerSentiment, customerMentalHealth, analyzeTone, sanitizeInput, adjustedTitle, adjustedContent]);

  if (error) {
    return <div role="alert">{errorFallbackContent}</div>; // Render fallback on error
  }

  return (
    <div aria-label="Mood-adjusted Email">
      <h1>{adjustedTitle}</h1>
      <p>{adjustedContent}</p>
    </div>
  );
};

export default MoodMail;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { sendAnalyticsEvent } from './analytics';

// Define a type for the tone adjustment value
type ToneAdjustment = -1 | 0 | 1;

interface MoodMailProps {
  title: string;
  content: string;
  customerSentiment: number;
  customerMentalHealth: number;
  // Optional error boundary fallback content
  errorFallbackContent?: React.ReactNode;
}

const MoodMail: React.FC<MoodMailProps> = ({
  title,
  content,
  customerSentiment,
  customerMentalHealth,
  errorFallbackContent = <p>Error displaying content.</p>, // Default fallback
}) => {
  const [adjustedTitle, setAdjustedTitle] = useState<string>(title);
  const [adjustedContent, setAdjustedContent] = useState<string>(content);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);

  // Use useCallback to memoize the analyzeTone function
  const analyzeTone = useCallback(
    (sentiment: number, mentalHealth: number): ToneAdjustment => {
      if (typeof sentiment !== 'number' || typeof mentalHealth !== 'number') {
        console.warn('Invalid sentiment or mental health value. Must be a number.');
        return 0; // Default to neutral tone
      }

      if (sentiment < 0 || sentiment > 1 || mentalHealth < 0 || mentalHealth > 1) {
        console.warn('Sentiment and mentalHealth should be between 0 and 1.');
        return 0;
      }

      if (sentiment < 0.4 || mentalHealth < 0.6) {
        return -1; // More empathetic and supportive
      } else if (sentiment > 0.7 && mentalHealth > 0.8) {
        return 1; // More upbeat and positive
      }
      return 0; // Neutral tone
    },
    []
  );

  // Use useCallback to memoize the sanitizeInput function
  const sanitizeInput = useCallback(
    (input: string, adjustedTone: ToneAdjustment): string => {
      if (typeof input !== 'string') {
        console.warn('Invalid input. Must be a string.');
        return ''; // Return an empty string to prevent crashes
      }

      let sanitizedInput = input;
      try {
        if (adjustedTone === -1) {
          sanitizedInput = sanitizedInput.replace(/!+/g, '.');
        } else if (adjustedTone === 1) {
          sanitizedInput = sanitizedInput.replace(/\.+/g, '!');
        }
      } catch (e: any) {
        console.error('Error during sanitization:', e);
        return input; // Return the original input on error
      }
      return sanitizedInput;
    },
    []
  );

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    try {
      const adjustedTone = analyzeTone(customerSentiment, customerMentalHealth);
      setAdjustedTitle(sanitizeInput(title, adjustedTone));
      setAdjustedContent(sanitizeInput(content, adjustedTone));

      sendAnalyticsEvent('email_displayed', {
        title: adjustedTitle,
        content: adjustedContent,
        customerSentiment,
        customerMentalHealth,
      });
    } catch (e: any) {
      if (isMountedRef.current) {
        console.error('Error processing MoodMail:', e);
        setError(e);
      }
    }
  }, [title, content, customerSentiment, customerMentalHealth, analyzeTone, sanitizeInput, adjustedTitle, adjustedContent]);

  if (error) {
    return <div role="alert">{errorFallbackContent}</div>; // Render fallback on error
  }

  return (
    <div aria-label="Mood-adjusted Email">
      <h1>{adjustedTitle}</h1>
      <p>{adjustedContent}</p>
    </div>
  );
};

export default MoodMail;