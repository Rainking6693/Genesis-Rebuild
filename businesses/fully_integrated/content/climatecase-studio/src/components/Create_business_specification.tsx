import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

interface CaseStudyProps {
  title: string;
  description: string;
  businessData: any;
  climateImpact: any;
}

const CaseStudy: React.FC<CaseStudyProps> = ({ title, description, businessData, climateImpact }) => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(false);

  const generateContent = useCallback(async () => {
    try {
      const config: AxiosRequestConfig = {
        params: { title, businessData, climateImpact },
        timeout: 10000, // Set a timeout to handle slow or unresponsive requests
      };

      const { data } = await axios.get<{ content: string }>('/api/case-study-content', config);
      if (isMounted.current) {
        setContent(data.content);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        const error = err as AxiosError;
        console.error('Error fetching case study content:', error);
        setContent('Error generating case study content.');
        setError('An error occurred while fetching the case study content.');
      }
    }
  }, [title, businessData, climateImpact]);

  useEffect(() => {
    isMounted.current = true;
    generateContent();

    return () => {
      isMounted.current = false;
    };
  }, [generateContent]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {error ? (
        <div role="alert" aria-live="assertive" aria-atomic="true">
          {error}
        </div>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          aria-live="polite"
          aria-atomic="true"
          tabIndex={0}
          role="region"
          aria-label="Case study content"
        />
      )}
    </div>
  );
};

export default CaseStudy;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

interface CaseStudyProps {
  title: string;
  description: string;
  businessData: any;
  climateImpact: any;
}

const CaseStudy: React.FC<CaseStudyProps> = ({ title, description, businessData, climateImpact }) => {
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(false);

  const generateContent = useCallback(async () => {
    try {
      const config: AxiosRequestConfig = {
        params: { title, businessData, climateImpact },
        timeout: 10000, // Set a timeout to handle slow or unresponsive requests
      };

      const { data } = await axios.get<{ content: string }>('/api/case-study-content', config);
      if (isMounted.current) {
        setContent(data.content);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        const error = err as AxiosError;
        console.error('Error fetching case study content:', error);
        setContent('Error generating case study content.');
        setError('An error occurred while fetching the case study content.');
      }
    }
  }, [title, businessData, climateImpact]);

  useEffect(() => {
    isMounted.current = true;
    generateContent();

    return () => {
      isMounted.current = false;
    };
  }, [generateContent]);

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      {error ? (
        <div role="alert" aria-live="assertive" aria-atomic="true">
          {error}
        </div>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          aria-live="polite"
          aria-atomic="true"
          tabIndex={0}
          role="region"
          aria-label="Case study content"
        />
      )}
    </div>
  );
};

export default CaseStudy;