import React, { useState, useEffect, useCallback } from 'react';

interface EmailMarketingProps {
  subscriberCount: number;
  openRate: number;
  clickThroughRate: number;
  onSubscribe: () => Promise<void> | void;
  onUnsubscribe: () => Promise<void> | void;
  buttonStyle?: React.CSSProperties;
  onError?: (error: Error) => void;
  onSubscribeError?: (error: Error) => void;
  onUnsubscribeError?: (error: Error) => void;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({
  subscriberCount,
  openRate,
  clickThroughRate,
  onSubscribe,
  onUnsubscribe,
  buttonStyle,
  onError,
  onSubscribeError,
  onUnsubscribeError,
}) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const localStorageKey = 'isSubscribed';

  // Use useCallback to memoize the subscription status update
  const updateSubscriptionStatus = useCallback((status: boolean) => {
    setIsSubscribed(status);
    try {
      localStorage.setItem(localStorageKey, String(status));
    } catch (error) {
      console.error('Error saving subscription status to localStorage:', error);
      // Handle localStorage error gracefully, e.g., display a message to the user
      setErrorMessage('Failed to save subscription status. Please check your browser settings.');
      onError?.(error instanceof Error ? error : new Error("Failed to save subscription status to localStorage")); // Call onError if provided
    }
  }, [onError]);

  useEffect(() => {
    const checkSubscriptionStatus = () => {
      try {
        const storedSubscriptionStatus = localStorage.getItem(localStorageKey);
        if (storedSubscriptionStatus === 'true') {
          setIsSubscribed(true);
        } else if (storedSubscriptionStatus === 'false') {
          setIsSubscribed(false);
        }
        // If null, leave as default (false)
      } catch (error) {
        console.error('Error reading subscription status from localStorage:', error);
        setErrorMessage('Failed to retrieve subscription status. Please check your browser settings.');
        onError?.(error instanceof Error ? error : new Error("Failed to retrieve subscription status from localStorage")); // Call onError if provided
      }
    };

    checkSubscriptionStatus();
  }, [onError]);

  const handleSubscribe = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null); // Clear any previous errors

    try {
      await onSubscribe();
      updateSubscriptionStatus(true);
    } catch (error) {
      console.error('Subscription failed:', error);
      setErrorMessage('Subscription failed. Please try again later.');
      onSubscribeError?.(error instanceof Error ? error : new Error("Subscription failed")); // Call onSubscribeError if provided
    } finally {
      setIsLoading(false);
    }
  }, [onSubscribe, onSubscribeError]);

  const handleUnsubscribe = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null); // Clear any previous errors

    try {
      await onUnsubscribe();
      updateSubscriptionStatus(false);
    } catch (error) {
      console.error('Unsubscription failed:', error);
      setErrorMessage('Unsubscription failed. Please try again later.');
      onUnsubscribeError?.(error instanceof Error ? error : new Error("Unsubscription failed")); // Call onUnsubscribeError if provided
    } finally {
      setIsLoading(false);
    }
  }, [onUnsubscribe, onUnsubscribeError]);

  const buttonText = isSubscribed ? 'Unsubscribe' : 'Subscribe to Price Alerts';

  return (
    <div aria-live="polite">
      <h3>Email Marketing Performance</h3>
      <p>Subscribers: {subscriberCount}</p>
      <p>Open Rate: {openRate}%</p>
      <p>Click-Through Rate: {clickThroughRate}%</p>

      {errorMessage && (
        <div style={{ color: 'red' }} role="alert">
          {errorMessage}
        </div>
      )}

      <button
        onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
        disabled={isLoading}
        style={{
          cursor: isLoading ? 'not-allowed' : 'pointer',
          ...buttonStyle, // Apply custom styles
        }}
        aria-label={isLoading ? "Loading..." : buttonText}
      >
        {isLoading ? 'Loading...' : buttonText}
      </button>
    </div>
  );
};

export default EmailMarketing;

Changes:

1. Added `onSubscribeError` and `onUnsubscribeError` props to handle errors specifically for subscribing and unsubscribing.
2. Moved the subscription status update function into a separate `useCallback` hook to improve performance.
3. Added `useCallback` to the `handleSubscribe` and `handleUnsubscribe` functions to prevent unnecessary re-renders.
4. Improved error handling by providing more specific error messages and separating subscription and unsubscription errors.
5. Added `aria-live="polite"` to the root div for better accessibility.