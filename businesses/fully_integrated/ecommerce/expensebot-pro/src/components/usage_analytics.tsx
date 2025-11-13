import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  message: string;
}

interface UsageAnalyticsError {
  message: string;
  stack: string;
}

interface Analytics {
  trackEvent(eventName: string, eventAction: string, eventLabel: string): void;
}

const UsageAnalytics: FC<Props> = ({ message }) => {
  const [error, setError] = useState<UsageAnalyticsError | null>(null);

  useEffect(() => {
    let analytics: Analytics | null = window.analytics;

    if (!analytics) {
      analytics = new Analytics();
      // Assuming you have a way to initialize the Analytics class here
    }

    try {
      analytics.trackEvent('UsageAnalytics', 'Display', message);
    } catch (error) {
      setError({ message: 'UsageAnalytics Error', stack: error.stack });
      UsageAnalytics.error(error);
    }
  }, [message]);

  if (error) {
    return (
      <div className="usage-analytics-container usage-analytics-error">
        <div role="alert">Error:</div>
        <div>{error.message}</div>
        <div role="alert">Stack:</div>
        <div>{error.stack}</div>
      </div>
    );
  }

  return <div className="usage-analytics-container">{message}</div>;
};

UsageAnalytics.displayName = 'UsageAnalytics';
UsageAnalytics.error = (error: Error) => {
  console.error('UsageAnalytics Error:', error);
};

// Optimize performance by memoizing the component if props don't change
const MemoizedUsageAnalytics = React.memo(UsageAnalytics);

export default MemoizedUsageAnalytics;

import React, { FC, ReactNode, useEffect, useState } from 'react';

interface Props {
  message: string;
}

interface UsageAnalyticsError {
  message: string;
  stack: string;
}

interface Analytics {
  trackEvent(eventName: string, eventAction: string, eventLabel: string): void;
}

const UsageAnalytics: FC<Props> = ({ message }) => {
  const [error, setError] = useState<UsageAnalyticsError | null>(null);

  useEffect(() => {
    let analytics: Analytics | null = window.analytics;

    if (!analytics) {
      analytics = new Analytics();
      // Assuming you have a way to initialize the Analytics class here
    }

    try {
      analytics.trackEvent('UsageAnalytics', 'Display', message);
    } catch (error) {
      setError({ message: 'UsageAnalytics Error', stack: error.stack });
      UsageAnalytics.error(error);
    }
  }, [message]);

  if (error) {
    return (
      <div className="usage-analytics-container usage-analytics-error">
        <div role="alert">Error:</div>
        <div>{error.message}</div>
        <div role="alert">Stack:</div>
        <div>{error.stack}</div>
      </div>
    );
  }

  return <div className="usage-analytics-container">{message}</div>;
};

UsageAnalytics.displayName = 'UsageAnalytics';
UsageAnalytics.error = (error: Error) => {
  console.error('UsageAnalytics Error:', error);
};

// Optimize performance by memoizing the component if props don't change
const MemoizedUsageAnalytics = React.memo(UsageAnalytics);

export default MemoizedUsageAnalytics;