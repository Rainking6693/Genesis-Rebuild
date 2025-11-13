import React, { useEffect, useState } from 'react';
import { FunctionComponent as FC } from 'react';

interface UsageAnalyticsProps {
  message: string;
  isProduction?: boolean;
}

type SendAnalytics = (message: string) => void;

const UsageAnalytics: FC<UsageAnalyticsProps> = ({ message, isProduction = false }) => {
  const [analyticsSent, setAnalyticsSent] = useState(false);

  const sendAnalytics: SendAnalytics = (message: string) => {
    try {
      // Implement your analytics service here
      console.log(`Analytics message: ${message}`);
    } catch (error) {
      console.error(`Error sending analytics: ${error.message}`);
    }
  };

  useEffect(() => {
    if (isProduction && !analyticsSent) {
      sendAnalytics(message);
      setAnalyticsSent(true);
    }
  }, [message, isProduction, analyticsSent]);

  return (
    <div>
      {!analyticsSent && message.length > 0 && (
        <div role="alert" aria-live="assertive" key="analytics-not-sent">
          {message}
        </div>
      )}
      {analyticsSent && <div role="status" aria-live="polite" key="analytics-sent">Analytics sent</div>}
    </div>
  );
};

export default UsageAnalytics;

import React, { useEffect, useState } from 'react';
import { FunctionComponent as FC } from 'react';

interface UsageAnalyticsProps {
  message: string;
  isProduction?: boolean;
}

type SendAnalytics = (message: string) => void;

const UsageAnalytics: FC<UsageAnalyticsProps> = ({ message, isProduction = false }) => {
  const [analyticsSent, setAnalyticsSent] = useState(false);

  const sendAnalytics: SendAnalytics = (message: string) => {
    try {
      // Implement your analytics service here
      console.log(`Analytics message: ${message}`);
    } catch (error) {
      console.error(`Error sending analytics: ${error.message}`);
    }
  };

  useEffect(() => {
    if (isProduction && !analyticsSent) {
      sendAnalytics(message);
      setAnalyticsSent(true);
    }
  }, [message, isProduction, analyticsSent]);

  return (
    <div>
      {!analyticsSent && message.length > 0 && (
        <div role="alert" aria-live="assertive" key="analytics-not-sent">
          {message}
        </div>
      )}
      {analyticsSent && <div role="status" aria-live="polite" key="analytics-sent">Analytics sent</div>}
    </div>
  );
};

export default UsageAnalytics;