import React, { PropsWithChildren, useRef, useState } from 'react';

interface Props {
  reportMessage: string; // Message related to the carbon footprint or sustainability report.
  isLoading?: boolean; // Indicates whether the report is currently being loaded. Defaults to false.
  error?: Error; // Error that occurred while loading the report.
  ariaLabel?: string; // Accessibility label for the component. Defaults to 'Sustainability Report'.
  onError?: (error: Error) => void; // Callback for handling errors.
}

const SustainabilityReportComponent: React.FC<Props> = ({
  reportMessage,
  isLoading = false,
  error,
  ariaLabel = 'Sustainability Report',
  onError = () => {},
  children,
}) => {
  const errorRef = useRef<HTMLDivElement>(null);

  const handleError = (error: Error) => {
    onError(error);
    if (errorRef.current) {
      errorRef.current.focus();
    }
  };

  if (isLoading) {
    return <div>Loading sustainability report...</div>;
  }

  if (error) {
    handleError(error);
    return (
      <div role="alert" ref={errorRef}>
        <p>An error occurred while loading the sustainability report:</p>
        <pre>{error.message}</pre>
      </div>
    );
  }

  return (
    <div aria-label={ariaLabel}>
      {reportMessage}
      {children}
    </div>
  );
};

export default SustainabilityReportComponent;

import React, { PropsWithChildren, useRef, useState } from 'react';

interface Props {
  reportMessage: string; // Message related to the carbon footprint or sustainability report.
  isLoading?: boolean; // Indicates whether the report is currently being loaded. Defaults to false.
  error?: Error; // Error that occurred while loading the report.
  ariaLabel?: string; // Accessibility label for the component. Defaults to 'Sustainability Report'.
  onError?: (error: Error) => void; // Callback for handling errors.
}

const SustainabilityReportComponent: React.FC<Props> = ({
  reportMessage,
  isLoading = false,
  error,
  ariaLabel = 'Sustainability Report',
  onError = () => {},
  children,
}) => {
  const errorRef = useRef<HTMLDivElement>(null);

  const handleError = (error: Error) => {
    onError(error);
    if (errorRef.current) {
      errorRef.current.focus();
    }
  };

  if (isLoading) {
    return <div>Loading sustainability report...</div>;
  }

  if (error) {
    handleError(error);
    return (
      <div role="alert" ref={errorRef}>
        <p>An error occurred while loading the sustainability report:</p>
        <pre>{error.message}</pre>
      </div>
    );
  }

  return (
    <div aria-label={ariaLabel}>
      {reportMessage}
      {children}
    </div>
  );
};

export default SustainabilityReportComponent;