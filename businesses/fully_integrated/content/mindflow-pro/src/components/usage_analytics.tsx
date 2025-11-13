import React, { FC, useEffect, useState } from 'react';
import { useUsageAnalytics } from '../../hooks/usage-analytics';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const { trackUsage } = useUsageAnalytics();
  const [error, setError] = useState<Error | null>(null);

  // Check if trackUsage and message are provided before tracking usage analytics
  const shouldTrack = trackUsage && message;

  useEffect(() => {
    if (shouldTrack) {
      let tracker: () => void;

      try {
        tracker = () => {
          trackUsage(message);
        };
      } catch (error) {
        setError(error);
      }

      // Debounce tracking to avoid flooding the server with requests
      let timeoutId: NodeJS.Timeout | null = null;
      const debounce = (func: () => void, delay: number) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => func(), delay);
      };

      debounce(tracker, 1000); // Debounce delay is 1 second
    }
  }, [message, trackUsage]);

  // Add an accessibility label for screen readers
  const ariaLabel = `Usage analytics: ${message}`;

  return (
    <div className="usage-analytics-message" aria-label={ariaLabel}>
      {message}
      {error && <div className="error-message">An error occurred: {error.message}</div>}
    </div>
  );
};

export default MyComponent;

import React, { FC, useEffect, useState } from 'react';
import { useUsageAnalytics } from '../../hooks/usage-analytics';

interface Props {
  message: string;
}

const MyComponent: FC<Props> = ({ message }) => {
  const { trackUsage } = useUsageAnalytics();
  const [error, setError] = useState<Error | null>(null);

  // Check if trackUsage and message are provided before tracking usage analytics
  const shouldTrack = trackUsage && message;

  useEffect(() => {
    if (shouldTrack) {
      let tracker: () => void;

      try {
        tracker = () => {
          trackUsage(message);
        };
      } catch (error) {
        setError(error);
      }

      // Debounce tracking to avoid flooding the server with requests
      let timeoutId: NodeJS.Timeout | null = null;
      const debounce = (func: () => void, delay: number) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => func(), delay);
      };

      debounce(tracker, 1000); // Debounce delay is 1 second
    }
  }, [message, trackUsage]);

  // Add an accessibility label for screen readers
  const ariaLabel = `Usage analytics: ${message}`;

  return (
    <div className="usage-analytics-message" aria-label={ariaLabel}>
      {message}
      {error && <div className="error-message">An error occurred: {error.message}</div>}
    </div>
  );
};

export default MyComponent;