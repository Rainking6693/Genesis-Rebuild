import React, { FC, PropsWithChildren, useState } from 'react';

interface Props {
  subject: string;
  message: string;
  loading?: boolean;
  loadingMessage?: string;
  error?: Error | string;
  errorMessage?: string;
  onLoad?: () => void;
  loadingClassName?: string;
  errorClassName?: string;
}

const EmailTemplate: FC<Props> = ({
  subject,
  message,
  loading = false,
  loadingMessage = 'Loading...',
  error,
  errorMessage = 'An error occurred.',
  onLoad,
  loadingClassName,
  errorClassName,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(loading);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(loading);
      onLoad && onLoad();
    }
  }, [loading, onLoad]);

  if (isLoading) {
    return (
      <div className={loadingClassName}>
        {loadingMessage}
      </div>
    );
  }

  if (error) {
    return (
      <div className={errorClassName}>
        {errorMessage}
        {children}
      </div>
    );
  }

  return (
    <div>
      <h2>{subject}</h2>
      <div>{message}</div>
      {children}
    </div>
  );
};

EmailTemplate.displayName = 'EmailTemplate';
EmailTemplate.ariaLabel = 'Email Template';

export default EmailTemplate;

// CommunityPulseWeeklyReport.tsx
import React, { useEffect, useState } from 'react';
import EmailTemplate from './EmailTemplate';

const CommunityPulseWeeklyReport = () => {
  const [reportData, setReportData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.communitypulse.com/reports/weekly');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReportData(data.message);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData().catch((error) => {
      console.error('Error fetching data:', error);
    });
  }, []);

  return (
    <EmailTemplate
      subject="Weekly Community Pulse Report"
      message={reportData || ''}
      loading={isLoading}
      onLoad={() => console.log('Email loaded')}
      error={error}
      loadingClassName="loading-container"
      errorClassName="error-container"
    />
  );
};

CommunityPulseWeeklyReport.ariaLabel = 'Weekly Community Pulse Report';

export default CommunityPulseWeeklyReport;

This updated codebase provides a more robust and flexible solution for email marketing components, allowing for better handling of edge cases, improved accessibility, and easier maintainability.