import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

interface ReportingEngineProps {
  message: string;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  fallback?: ReactNode;
}

interface ReportingEngineErrorBoundaryProps extends ReportingEngineProps {
  componentDidCatch: (error: Error, info: React.ErrorInfo) => void;
}

const ReportingEngine: FC<ReportingEngineProps> = ({ message, onError, fallback }) => {
  const [error, setError] = useState<Error | null>(null);
  const errorBoundaryRef = useRef<ReportingEngineErrorBoundary>(null);

  useEffect(() => {
    if (errorBoundaryRef.current) {
      errorBoundaryRef.current.componentDidCatch(error, { componentStack: new Error(error).stack });
    }
  }, [error]);

  const handleError = (error: Error) => {
    setError(error);
    if (onError) onError(error, { componentStack: new Error(error).stack });
  };

  return (
    <div className="report-container" role="alert">
      {error ? (
        <ReportingEngineErrorBoundary
          ref={errorBoundaryRef}
          onError={handleError}
          fallback={fallback}
        >
          {error.message}
        </ReportingEngineErrorBoundary>
      ) : (
        <div>{message}</div>
      )}
      <div id="report-error-details" aria-hidden={!error}>
        {error && <pre>{error.stack}</pre>}
      </div>
    </div>
  );
};

ReportingEngine.displayName = 'EcoMetricsProReportingEngine';

ReportingEngine.defaultProps = {
  message: 'Loading ESG report...',
};

class ReportingEngineErrorBoundary extends React.Component<ReportingEngineErrorBoundaryProps> {
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ReportingEngine error:', error, info);
    this.props.onError(error, info);
  }

  render() {
    return this.props.fallback || this.props.children;
  }
}

export default ReportingEngine;

import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

interface ReportingEngineProps {
  message: string;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  fallback?: ReactNode;
}

interface ReportingEngineErrorBoundaryProps extends ReportingEngineProps {
  componentDidCatch: (error: Error, info: React.ErrorInfo) => void;
}

const ReportingEngine: FC<ReportingEngineProps> = ({ message, onError, fallback }) => {
  const [error, setError] = useState<Error | null>(null);
  const errorBoundaryRef = useRef<ReportingEngineErrorBoundary>(null);

  useEffect(() => {
    if (errorBoundaryRef.current) {
      errorBoundaryRef.current.componentDidCatch(error, { componentStack: new Error(error).stack });
    }
  }, [error]);

  const handleError = (error: Error) => {
    setError(error);
    if (onError) onError(error, { componentStack: new Error(error).stack });
  };

  return (
    <div className="report-container" role="alert">
      {error ? (
        <ReportingEngineErrorBoundary
          ref={errorBoundaryRef}
          onError={handleError}
          fallback={fallback}
        >
          {error.message}
        </ReportingEngineErrorBoundary>
      ) : (
        <div>{message}</div>
      )}
      <div id="report-error-details" aria-hidden={!error}>
        {error && <pre>{error.stack}</pre>}
      </div>
    </div>
  );
};

ReportingEngine.displayName = 'EcoMetricsProReportingEngine';

ReportingEngine.defaultProps = {
  message: 'Loading ESG report...',
};

class ReportingEngineErrorBoundary extends React.Component<ReportingEngineErrorBoundaryProps> {
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ReportingEngine error:', error, info);
    this.props.onError(error, info);
  }

  render() {
    return this.props.fallback || this.props.children;
  }
}

export default ReportingEngine;