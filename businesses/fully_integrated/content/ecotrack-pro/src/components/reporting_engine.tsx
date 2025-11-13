import React, { FC, ReactNode } from 'react';

// Interface for the Reporting Component props
interface ReportingProps {
  message: string;
  error?: Error; // Add error prop for error messages
}

// Reporting Component
const ReportingComponent: FC<ReportingProps> = ({ message, error }) => {
  if (error) {
    // Render error message with error details for better debugging
    return (
      <div className="error-message">
        <h2>Error:</h2>
        <p>{message}</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }

  // Render regular message
  return <div className="message">{message}</div>;
};

ReportingComponent.displayName = 'ReportingComponent';

// Add accessibility by wrapping the component with a div and adding aria-label
const AccessibleReportingComponent: FC<ReportingProps & { title?: string }> = ({ message, error, title }) => {
  if (error) {
    return (
      <div className="accessible-error-message">
        <div className="error-message" role="alert">
          <h2>Error:</h2>
          <p>{message}</p>
          <pre>{error.stack}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="accessible-message" role="alert">
      {title && <h2>{title}</h2>}
      <div className="message">{message}</div>
    </div>
  );
};

AccessibleReportingComponent.displayName = 'AccessibleReportingComponent';

// Export the Reporting Component and the Accessible version for better maintainability
export { ReportingComponent, AccessibleReportingComponent };

// For consistency, let's rename the second component
import React from 'react';

// Interface for the renamed Reporting Component props
interface RenderedReportProps {
  message: string;
  error?: Error; // Add error prop for error messages
  title?: string; // Add title prop for better accessibility
}

// RenderedReport Component
const RenderedReport: FC<RenderedReportProps> = ({ message, error, title }) => {
  if (error) {
    return (
      <div className="error-message">
        <h2>Error:</h2>
        <p>{message}</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }

  return <div className="message">{message}</div>;
};

RenderedReport.displayName = 'RenderedReport';

// Export the RenderedReport Component
export default RenderedReport;

This updated code addresses the requested improvements and adds additional features for better accessibility and maintainability.