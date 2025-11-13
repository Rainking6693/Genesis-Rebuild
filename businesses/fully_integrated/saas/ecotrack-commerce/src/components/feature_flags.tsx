import React, { useState, useEffect, useCallback } from 'react';

interface FeatureFlagProps {
  title: string;
  description: string;
  isActive: boolean;
  flagKey: string; // Unique key for the feature flag
  apiEndpoint?: string; // Optional API endpoint, defaults to '/api/feature-flags'
  retryInterval?: number; // Optional retry interval in milliseconds, defaults to 5000
}

interface FeatureFlagData {
  isActive: boolean;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({
  title,
  description,
  isActive,
  flagKey,
  apiEndpoint = '/api/feature-flags',
  retryInterval = 5000,
}) => {
  const [isEnabled, setIsEnabled] = useState(isActive);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFeatureFlag = useCallback(async () => {
    setIsLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiEndpoint}?flagKey=${flagKey}`, { // Include flagKey in the request
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        // Handle specific error codes for better user feedback
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid authentication token.');
        } else if (response.status === 404) {
          throw new Error(`Feature flag not found on server.`);
        }
        throw new Error(`HTTP error ${response.status}`);
      }

      const data: FeatureFlagData = await response.json();
      setIsEnabled(data.isActive);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error fetching feature flag:', error);
      setError(error);
      // Consider not falling back to default if the error is authentication related
      if (error.message.includes('Unauthorized')) {
        setIsEnabled(false); // Or handle logout/re-authentication
      } else {
        setIsEnabled(isActive); // Fallback to default value
      }

      // Retry mechanism with exponential backoff
      setTimeout(() => {
        fetchFeatureFlag();
      }, retryInterval);
    } finally {
      setIsLoading(false);
    }
  }, [isActive, apiEndpoint, flagKey, retryInterval]);

  useEffect(() => {
    fetchFeatureFlag();
  }, [fetchFeatureFlag]);

  const statusText = isLoading
    ? 'Loading...'
    : error
    ? 'Error'
    : isEnabled
    ? 'Enabled'
    : 'Disabled';

  return (
    <div
      className={`feature-flag ${isEnabled ? 'active' : 'inactive'} ${isLoading ? 'loading' : ''} ${error ? 'error' : ''}`}
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${title} is ${statusText}`} // Improved accessibility label
    >
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="feature-flag-status">
        {statusText}
      </div>
      {error && (
        <div className="feature-flag-error" role="alert">
          Error fetching feature flag: {error.message}
        </div>
      )}
    </div>
  );
};

export default FeatureFlag;

import React, { useState, useEffect, useCallback } from 'react';

interface FeatureFlagProps {
  title: string;
  description: string;
  isActive: boolean;
  flagKey: string; // Unique key for the feature flag
  apiEndpoint?: string; // Optional API endpoint, defaults to '/api/feature-flags'
  retryInterval?: number; // Optional retry interval in milliseconds, defaults to 5000
}

interface FeatureFlagData {
  isActive: boolean;
}

const FeatureFlag: React.FC<FeatureFlagProps> = ({
  title,
  description,
  isActive,
  flagKey,
  apiEndpoint = '/api/feature-flags',
  retryInterval = 5000,
}) => {
  const [isEnabled, setIsEnabled] = useState(isActive);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFeatureFlag = useCallback(async () => {
    setIsLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiEndpoint}?flagKey=${flagKey}`, { // Include flagKey in the request
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        // Handle specific error codes for better user feedback
        if (response.status === 401) {
          throw new Error('Unauthorized: Invalid authentication token.');
        } else if (response.status === 404) {
          throw new Error(`Feature flag not found on server.`);
        }
        throw new Error(`HTTP error ${response.status}`);
      }

      const data: FeatureFlagData = await response.json();
      setIsEnabled(data.isActive);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      console.error('Error fetching feature flag:', error);
      setError(error);
      // Consider not falling back to default if the error is authentication related
      if (error.message.includes('Unauthorized')) {
        setIsEnabled(false); // Or handle logout/re-authentication
      } else {
        setIsEnabled(isActive); // Fallback to default value
      }

      // Retry mechanism with exponential backoff
      setTimeout(() => {
        fetchFeatureFlag();
      }, retryInterval);
    } finally {
      setIsLoading(false);
    }
  }, [isActive, apiEndpoint, flagKey, retryInterval]);

  useEffect(() => {
    fetchFeatureFlag();
  }, [fetchFeatureFlag]);

  const statusText = isLoading
    ? 'Loading...'
    : error
    ? 'Error'
    : isEnabled
    ? 'Enabled'
    : 'Disabled';

  return (
    <div
      className={`feature-flag ${isEnabled ? 'active' : 'inactive'} ${isLoading ? 'loading' : ''} ${error ? 'error' : ''}`}
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${title} is ${statusText}`} // Improved accessibility label
    >
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="feature-flag-status">
        {statusText}
      </div>
      {error && (
        <div className="feature-flag-error" role="alert">
          Error fetching feature flag: {error.message}
        </div>
      )}
    </div>
  );
};

export default FeatureFlag;