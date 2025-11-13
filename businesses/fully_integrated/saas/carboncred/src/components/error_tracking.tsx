import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ErrorReportingService } from './error_reporting_service';

interface Props {
  message: string;
}

const ErrorReportingServiceInstance = useMemo(() => new ErrorReportingService(), []);

const ForwardRefErrorTrackingComponent = React.forwardRef((props: Props, ref) => {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const reportError = useCallback(async (message: string) => {
    setLoading(true);
    try {
      await ErrorReportingServiceInstance.reportError(message);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reportError(props.message);
  }, [props.message, reportError]);

  if (error) {
    return (
      <div aria-label="An error occurred" data-testid="error-message">
        {loading ? 'Reporting error...' : 'An error occurred: '}
        {error.message}
      </div>
    );
  }

  return (
    <div aria-label={props.message} data-testid="message" ref={ref}>
      {props.message}
    </div>
  );
});

ForwardRefErrorTrackingComponent.displayName = 'ErrorTrackingComponent';

export default ForwardRefErrorTrackingComponent;

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ErrorReportingService } from './error_reporting_service';

interface Props {
  message: string;
}

const ErrorReportingServiceInstance = useMemo(() => new ErrorReportingService(), []);

const ForwardRefErrorTrackingComponent = React.forwardRef((props: Props, ref) => {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const reportError = useCallback(async (message: string) => {
    setLoading(true);
    try {
      await ErrorReportingServiceInstance.reportError(message);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reportError(props.message);
  }, [props.message, reportError]);

  if (error) {
    return (
      <div aria-label="An error occurred" data-testid="error-message">
        {loading ? 'Reporting error...' : 'An error occurred: '}
        {error.message}
      </div>
    );
  }

  return (
    <div aria-label={props.message} data-testid="message" ref={ref}>
      {props.message}
    </div>
  );
});

ForwardRefErrorTrackingComponent.displayName = 'ErrorTrackingComponent';

export default ForwardRefErrorTrackingComponent;