import React, { useState, Dispatch, SetStateAction, ReactNode } from 'react';

type ReportProps = {
  titleId?: string;
  messageId?: string;
  role?: string;
  ariaLabel?: string;
  ariaHidden?: boolean;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
  dataTestid?: string;
  title: string;
  message: string;
  isLoading?: boolean;
  onClick?: () => void;
};

const Report: React.FC<ReportProps> = ({
  titleId,
  messageId,
  role,
  ariaLabel,
  ariaHidden,
  ariaLabelledby,
  ariaDescribedby,
  dataTestid,
  title,
  message,
  isLoading,
  onClick,
}) => {
  return (
    <div data-testid={dataTestid} role={role} aria-label={ariaLabel} aria-hidden={ariaHidden} id={ariaLabelledby}>
      <h2 id={titleId} className="report-title">{title}</h2>
      {isLoading ? <div className="report-loading">Loading...</div> : <div className="report-content" onClick={onClick}>{message}</div>}
    </div>
  );
};

const CarbonFootprintReport = (props: ReportProps) => {
  return <Report {...props} />;
};

const SustainabilityChallengeReport = (props: ReportProps) => {
  return <Report {...props} />;
};

// Adding a custom error boundary to handle component errors
class ErrorBoundary extends React.Component<{ children: ReactNode; errorMessage?: string; onError?: (error: Error) => void }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    // Update state when an error occurs
    return { hasError: true };
  }

  componentDidCatch(error: Error, _info: any) {
    // Log the error to your error reporting service
    if (this.props.onError) this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      // You can return any custom fallback UI
      return <div>{this.props.errorMessage || "An error occurred while rendering the report."}</div>;
    }

    return this.props.children;
  }
}

// Wrap the report components with the error boundary
const CarbonFootprintReportWithErrorBoundary = (props: ReportProps) => (
  <ErrorBoundary {...props}>
    <CarbonFootprintReport {...props} />
  </ErrorBoundary>
);

const SustainabilityChallengeReportWithErrorBoundary = (props: ReportProps) => (
  <ErrorBoundary {...props}>
    <SustainabilityChallengeReport {...props} />
  </ErrorBoundary>
);

export {
  CarbonFootprintReportWithErrorBoundary,
  SustainabilityChallengeReportWithErrorBoundary,
};

This updated code provides better accessibility, resiliency, and maintainability for the reporting_engine component. It also supports loading states, click events, and custom error handling in the error boundary component.