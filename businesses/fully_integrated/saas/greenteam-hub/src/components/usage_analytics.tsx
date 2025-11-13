import React, { useState, useEffect } from 'react';

interface UsageAnalyticsProps {
  usageAnalyticsMessage: string;
  onError?: (error: Error) => void; // Add an optional error callback for reporting issues
  onSuccess?: () => void; // Add an optional success callback for notifying when analytics is successful
}

const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({ usageAnalyticsMessage, onError = () => {}, onSuccess }) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const performAnalytics = async () => {
      try {
        // Perform analytics here, e.g., sending data to an analytics service
        // For the sake of this example, we'll just log the message to the console
        console.log(usageAnalyticsMessage);
        setIsLoading(false);
        if (onSuccess) onSuccess();
      } catch (error) {
        if (isMounted) {
          setError(error);
          onError(error); // Report the error to the parent component or a central error reporting service
        }
      }
      return () => { isMounted = false; };
    };

    performAnalytics();
  }, [usageAnalyticsMessage, onError, onSuccess]);

  return (
    <div>
      {/* Add ARIA attributes for accessibility */}
      <div data-testid="usage-analytics" aria-label="Usage Analytics">
        {isLoading ? 'Loading...' : usageAnalyticsMessage}
      </div>
      {/* Display an error message if an error occurred */}
      {error && <div data-testid="usage-analytics-error" role="alert">An error occurred: {error.message}</div>}
    </div>
  );
};

export default UsageAnalytics;

import React, { useState, useEffect } from 'react';

interface UsageAnalyticsProps {
  usageAnalyticsMessage: string;
  onError?: (error: Error) => void; // Add an optional error callback for reporting issues
  onSuccess?: () => void; // Add an optional success callback for notifying when analytics is successful
}

const UsageAnalytics: React.FC<UsageAnalyticsProps> = ({ usageAnalyticsMessage, onError = () => {}, onSuccess }) => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const performAnalytics = async () => {
      try {
        // Perform analytics here, e.g., sending data to an analytics service
        // For the sake of this example, we'll just log the message to the console
        console.log(usageAnalyticsMessage);
        setIsLoading(false);
        if (onSuccess) onSuccess();
      } catch (error) {
        if (isMounted) {
          setError(error);
          onError(error); // Report the error to the parent component or a central error reporting service
        }
      }
      return () => { isMounted = false; };
    };

    performAnalytics();
  }, [usageAnalyticsMessage, onError, onSuccess]);

  return (
    <div>
      {/* Add ARIA attributes for accessibility */}
      <div data-testid="usage-analytics" aria-label="Usage Analytics">
        {isLoading ? 'Loading...' : usageAnalyticsMessage}
      </div>
      {/* Display an error message if an error occurred */}
      {error && <div data-testid="usage-analytics-error" role="alert">An error occurred: {error.message}</div>}
    </div>
  );
};

export default UsageAnalytics;