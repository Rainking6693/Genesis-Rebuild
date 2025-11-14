// reporting-component-props.ts
export interface ReportingComponentProps {
  message: string;
  isLoading?: boolean;
  error?: Error | null;
  ariaLabel?: string;
}

// MyReportingComponent.tsx
import React, { useState, useEffect } from 'react';
import { ReportingComponentProps } from './reporting-component-props';

const MyReportingComponent: React.FC<ReportingComponentProps> = ({ message, isLoading, error, ariaLabel }) => {
  const [loading, setLoading] = useState(isLoading || false);

  useEffect(() => {
    setLoading(isLoading || false);
  }, [isLoading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div role="alert">
        <p>An error occurred: {error.message}</p>
      </div>
    );
  }

  return (
    <div role="region" aria-label={ariaLabel || "Reporting component"}>
      <div>{message}</div>
    </div>
  );
};

export default MyReportingComponent;

// reporting-component-props.ts
export interface ReportingComponentProps {
  message: string;
  isLoading?: boolean;
  error?: Error | null;
  ariaLabel?: string;
}

// MyReportingComponent.tsx
import React, { useState, useEffect } from 'react';
import { ReportingComponentProps } from './reporting-component-props';

const MyReportingComponent: React.FC<ReportingComponentProps> = ({ message, isLoading, error, ariaLabel }) => {
  const [loading, setLoading] = useState(isLoading || false);

  useEffect(() => {
    setLoading(isLoading || false);
  }, [isLoading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div role="alert">
        <p>An error occurred: {error.message}</p>
      </div>
    );
  }

  return (
    <div role="region" aria-label={ariaLabel || "Reporting component"}>
      <div>{message}</div>
    </div>
  );
};

export default MyReportingComponent;