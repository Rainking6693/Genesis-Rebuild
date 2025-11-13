import React, { memo, useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

interface UsageAnalyticsProps {
  contentId: string;
  contentType: 'article' | 'video' | 'podcast';
  userId?: string | null; // Optional user ID for tracking logged-in users
  apiUrl: string; // URL for the analytics endpoint
  debounceInterval?: number; // Debounce interval in milliseconds (default: 500)
  onError?: (error: Error) => void; // Callback for handling errors
  onSuccess?: () => void; // Callback for successful tracking
  initialViewedPercentage?: number; // Initial viewed percentage (default: 0)
}

const UsageAnalytics: React.FC<UsageAnalyticsProps> = memo(({
  contentId,
  contentType,
  userId,
  apiUrl,
  debounceInterval = 500,
  onError,
  onSuccess,
  initialViewedPercentage = 0,
}) => {
  const [viewedPercentage, setViewedPercentage] = useState<number>(initialViewedPercentage);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  // Validate props using PropTypes (for runtime validation in development)
  UsageAnalytics.propTypes = {
    contentId: PropTypes.string.isRequired,
    contentType: PropTypes.oneOf(['article', 'video', 'podcast']).isRequired,
    userId: PropTypes.string,
    apiUrl: PropTypes.string.isRequired,
    debounceInterval: PropTypes.number,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
    initialViewedPercentage: PropTypes.number,
  };

  // Debounce function to prevent excessive API calls
  const debounce = useCallback((func: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout | null = null;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func();
      }, delay);
    };
  }, []);

  // Function to send analytics data to the server
  const sendAnalyticsData = useCallback(async () => {
    if (!isTracking) return;

    try {
      const payload = {
        contentId,
        contentType,
        userId: userId || null, // Send null if userId is undefined/null
        viewedPercentage,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Attempt to parse error response
        const errorMessage = errorData?.message || `HTTP error! Status: ${response.status}`;
        throw new Error(errorMessage);
      }

      onSuccess?.(); // Optional success callback
    } catch (error: any) {
      console.error('Error sending analytics data:', error);
      onError?.(error instanceof Error ? error : new Error(String(error))); // Optional error callback
    }
  }, [contentId, contentType, userId, apiUrl, viewedPercentage, onSuccess, onError, isTracking]);

  // Debounced version of sendAnalyticsData
  const debouncedSendAnalyticsData = useCallback(debounce(sendAnalyticsData, debounceInterval), [sendAnalyticsData, debounceInterval, debounce]);

  // Simulate content viewing progress (replace with actual implementation)
  useEffect(() => {
    setIsTracking(true); // Start tracking when the component mounts

    intervalIdRef.current = setInterval(() => {
      setViewedPercentage((prevPercentage) => {
        const newPercentage = Math.min(prevPercentage + 10, 100); // Increment by 10%, max 100%
        return newPercentage;
      });
    }, 1000);

    return () => {
      setIsTracking(false); // Stop tracking when the component unmounts
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  // Send analytics data whenever viewedPercentage changes
  useEffect(() => {
    debouncedSendAnalyticsData();
  }, [viewedPercentage, debouncedSendAnalyticsData]);

  return (
    <div data-testid="usage-analytics" aria-live="polite">
      <p>Content ID: {contentId}</p>
      <p>Content Type: {contentType}</p>
      {userId && <p>User ID: {userId}</p>}
      <p>Viewed Percentage: {viewedPercentage}%</p>
    </div>
  );
});

UsageAnalytics.displayName = 'UsageAnalytics'; // Helps with debugging in React DevTools

export default UsageAnalytics;

import React, { memo, useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

interface UsageAnalyticsProps {
  contentId: string;
  contentType: 'article' | 'video' | 'podcast';
  userId?: string | null; // Optional user ID for tracking logged-in users
  apiUrl: string; // URL for the analytics endpoint
  debounceInterval?: number; // Debounce interval in milliseconds (default: 500)
  onError?: (error: Error) => void; // Callback for handling errors
  onSuccess?: () => void; // Callback for successful tracking
  initialViewedPercentage?: number; // Initial viewed percentage (default: 0)
}

const UsageAnalytics: React.FC<UsageAnalyticsProps> = memo(({
  contentId,
  contentType,
  userId,
  apiUrl,
  debounceInterval = 500,
  onError,
  onSuccess,
  initialViewedPercentage = 0,
}) => {
  const [viewedPercentage, setViewedPercentage] = useState<number>(initialViewedPercentage);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  // Validate props using PropTypes (for runtime validation in development)
  UsageAnalytics.propTypes = {
    contentId: PropTypes.string.isRequired,
    contentType: PropTypes.oneOf(['article', 'video', 'podcast']).isRequired,
    userId: PropTypes.string,
    apiUrl: PropTypes.string.isRequired,
    debounceInterval: PropTypes.number,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
    initialViewedPercentage: PropTypes.number,
  };

  // Debounce function to prevent excessive API calls
  const debounce = useCallback((func: () => void, delay: number) => {
    let timeoutId: NodeJS.Timeout | null = null;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func();
      }, delay);
    };
  }, []);

  // Function to send analytics data to the server
  const sendAnalyticsData = useCallback(async () => {
    if (!isTracking) return;

    try {
      const payload = {
        contentId,
        contentType,
        userId: userId || null, // Send null if userId is undefined/null
        viewedPercentage,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Attempt to parse error response
        const errorMessage = errorData?.message || `HTTP error! Status: ${response.status}`;
        throw new Error(errorMessage);
      }

      onSuccess?.(); // Optional success callback
    } catch (error: any) {
      console.error('Error sending analytics data:', error);
      onError?.(error instanceof Error ? error : new Error(String(error))); // Optional error callback
    }
  }, [contentId, contentType, userId, apiUrl, viewedPercentage, onSuccess, onError, isTracking]);

  // Debounced version of sendAnalyticsData
  const debouncedSendAnalyticsData = useCallback(debounce(sendAnalyticsData, debounceInterval), [sendAnalyticsData, debounceInterval, debounce]);

  // Simulate content viewing progress (replace with actual implementation)
  useEffect(() => {
    setIsTracking(true); // Start tracking when the component mounts

    intervalIdRef.current = setInterval(() => {
      setViewedPercentage((prevPercentage) => {
        const newPercentage = Math.min(prevPercentage + 10, 100); // Increment by 10%, max 100%
        return newPercentage;
      });
    }, 1000);

    return () => {
      setIsTracking(false); // Stop tracking when the component unmounts
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  // Send analytics data whenever viewedPercentage changes
  useEffect(() => {
    debouncedSendAnalyticsData();
  }, [viewedPercentage, debouncedSendAnalyticsData]);

  return (
    <div data-testid="usage-analytics" aria-live="polite">
      <p>Content ID: {contentId}</p>
      <p>Content Type: {contentType}</p>
      {userId && <p>User ID: {userId}</p>}
      <p>Viewed Percentage: {viewedPercentage}%</p>
    </div>
  );
});

UsageAnalytics.displayName = 'UsageAnalytics'; // Helps with debugging in React DevTools

export default UsageAnalytics;