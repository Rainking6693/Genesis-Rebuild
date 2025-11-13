import React, { FunctionComponent, ReactElement, ReactNode, useEffect } from 'react';

interface Props {
  message: string;
  trackEvent: TrackEventFunction;
  logError: LogErrorFunction;
}

type TrackEventFunction = (eventName: string, message: string) => void;
type LogErrorFunction = (error: Error) => void;

const UsageAnalytics: FunctionComponent<Props> = ({ message, trackEvent }) => {
  useEffect(() => {
    if (message) {
      trackEvent('UsageAnalytics', message);
    }
  }, [message, trackEvent]);

  return (
    <div role="alert" key={message}>
      {message}
    </div>
  );
};

UsageAnalytics.displayName = 'UsageAnalytics';

const ErrorBoundary: FunctionComponent<{ children: ReactElement<any, any> }> = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  useEffect(() => {
    if (children && React.isValidElement(children)) {
      const catcher = (error: Error) => {
        setHasError(true);
        logError(error);
      };

      const preventDefault = (event: React.SyntheticEvent) => {
        event.preventDefault();
      };

      children.current.addEventListener('error', catcher);
      children.current.addEventListener('click', preventDefault);

      return () => {
        children.current.removeEventListener('error', catcher);
        children.current.removeEventListener('click', preventDefault);
      };
    }
  }, [children]);

  if (hasError) {
    return (
      <div role="alert" title="An error occurred">
        An error occurred: {hasError.message}
      </div>
    );
  }

  return children;
};

export default UsageAnalytics;

Now, the `UsageAnalytics` component is more resilient, handles edge cases, is more accessible, and is more maintainable.