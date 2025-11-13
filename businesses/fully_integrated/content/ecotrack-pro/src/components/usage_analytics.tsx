import React, { FC, useEffect, useContext, ErrorBoundary } from 'react';
import { useTranslation } from 'react-i18next';
import { AnalyticsContext } from './AnalyticsContext';

interface Props {
  messageId?: string;
}

const UsageAnalytics: FC<Props> = ({ messageId }) => {
  const { t } = useTranslation();
  const { trackEvent } = useContext(AnalyticsContext);
  const [analyticsMessage, setAnalyticsMessage] = React.useState<string>(t(messageId || 'loading_usage_analytics'));
  const [error, setError] = React.useState<Error | null>(null);

  useEffect(() => {
    try {
      trackEvent('UsageAnalyticsLoaded', { message: analyticsMessage });
    } catch (error) {
      setError(error);
    }
  }, [analyticsMessage, trackEvent]);

  useEffect(() => {
    if (error) {
      trackEvent('UsageAnalyticsError', { error: error.message });
    }
  }, [error]);

  return (
    <div className={`usage-analytics ${error ? 'error' : ''}`} role="alert">
      {error ? (
        <>
          <span role="img" aria-label="error">🚨</span>
          {analyticsMessage}
          <br />
          {error.message}
        </>
      ) : (
        analyticsMessage
      )}
    </div>
  );
};

UsageAnalytics.displayName = 'UsageAnalytics';

// Add error handling and logging for better reliability and maintainability
UsageAnalytics.defaultProps = {
  messageId: 'loading_usage_analytics',
};

UsageAnalytics.errorBoundary = (error: Error) => {
  console.error('Error in UsageAnalytics:', error);
  return <div className="error-message" role="alert">An error occurred in UsageAnalytics: {error.message}</div>;
};

export default UsageAnalytics;

In this updated version, I've added error handling for the `trackEvent` function, which will now log any errors that occur during the analytics event tracking. I've also added a state variable `error` to store any errors that occur, and I've updated the component's rendering to show an error message when an error occurs. Additionally, I've added an `error` class to the `usage-analytics` div when an error occurs, which can be used for styling. Lastly, I've updated the `errorBoundary` to accept an `Error` parameter and log the error message.