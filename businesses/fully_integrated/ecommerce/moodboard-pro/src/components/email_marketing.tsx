import React, { useState, useEffect, useCallback, useRef } from 'react';

interface EmailMarketingProps {
  userId: string; // User identifier for personalization
  initialSubscriptionStatus?: boolean; // Initial subscription status
  subscribeEndpoint?: string; // API endpoint for subscribing (optional, defaults to /api/subscribe)
  unsubscribeEndpoint?: string; // API endpoint for unsubscribing (optional, defaults to /api/unsubscribe)
  localStorageKeyPrefix?: string; // Prefix for local storage key (optional, defaults to 'subscription')
  emailPlaceholder?: string; // Placeholder text for the email input field
  subscribeButtonText?: string; // Text for the subscribe button
  unsubscribeButtonText?: string; // Text for the unsubscribe button
  successMessageDuration?: number; // Duration (in ms) to display success messages. Defaults to 3000ms
}

interface ApiResponse {
  message?: string;
}

const defaultSubscribeEndpoint = '/api/subscribe';
const defaultUnsubscribeEndpoint = '/api/unsubscribe';
const defaultLocalStorageKeyPrefix = 'subscription';
const defaultEmailPlaceholder = 'Enter your email';
const defaultSubscribeButtonText = 'Subscribe';
const defaultUnsubscribeButtonText = 'Unsubscribe';
const defaultSuccessMessageDuration = 3000;

const EmailMarketing: React.FC<EmailMarketingProps> = ({
  userId,
  initialSubscriptionStatus = false,
  subscribeEndpoint = defaultSubscribeEndpoint,
  unsubscribeEndpoint = defaultUnsubscribeEndpoint,
  localStorageKeyPrefix = defaultLocalStorageKeyPrefix,
  emailPlaceholder = defaultEmailPlaceholder,
  subscribeButtonText = defaultSubscribeButtonText,
  unsubscribeButtonText = defaultUnsubscribeButtonText,
  successMessageDuration = defaultSuccessMessageDuration,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(initialSubscriptionStatus);
  const [email, setEmail] = useState<string>(''); // State to hold the email address
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success messages
  const [isLoading, setIsLoading] = useState<boolean>(false); // State to indicate loading state
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true); // State to track email validity

  const localStorageKey = `${localStorageKeyPrefix}_${userId}`;
  const emailInputRef = useRef<HTMLInputElement>(null); // Ref for the email input

  // Accessibility: Aria labels for buttons
  const subscribeButtonLabel = isSubscribed ? `Unsubscribe from newsletter` : `Subscribe to newsletter`;

  // Load subscription status from local storage
  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      try {
        const storedSubscription = localStorage.getItem(localStorageKey);
        if (storedSubscription) {
          setIsSubscribed(storedSubscription === 'true');
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        setErrorMessage('Failed to load subscription status. Please try again.');
      }
    };

    loadSubscriptionStatus();
  }, [localStorageKey]);

  // Clear success message after a delay
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, successMessageDuration);

      return () => clearTimeout(timer); // Cleanup on unmount or message change
    }
  }, [successMessage, successMessageDuration]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    // Validate email on change, but don't set error message immediately
    setIsEmailValid(isValidEmail(newEmail));
  };

  // useCallback to prevent unnecessary re-renders
  const isValidEmail = useCallback((email: string): boolean => {
    if (!email) return true; // Allow empty string, validation happens on submit
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }, []);

  const handleSubscription = useCallback(
    async (action: 'subscribe' | 'unsubscribe') => {
      if (action === 'subscribe') {
        if (!email) {
          setErrorMessage('Please enter your email address.');
          setSuccessMessage(null);
          setIsEmailValid(false); // Set invalid state for accessibility
          if (emailInputRef.current) {
            emailInputRef.current.focus(); // Focus the input for immediate correction
          }
          return;
        }

        if (!isValidEmail(email)) {
          setErrorMessage('Please enter a valid email address.');
          setSuccessMessage(null);
          setIsEmailValid(false); // Set invalid state for accessibility
          if (emailInputRef.current) {
            emailInputRef.current.focus(); // Focus the input for immediate correction
          }
          return;
        }
      }

      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsEmailValid(true); // Reset email validity on submission

      const endpoint = action === 'subscribe' ? subscribeEndpoint : unsubscribeEndpoint;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, email }),
        });

        if (response.ok) {
          const newSubscriptionStatus = action === 'subscribe';
          setIsSubscribed(newSubscriptionStatus);
          try {
            localStorage.setItem(localStorageKey, String(newSubscriptionStatus));
          } catch (localStorageError: any) {
            console.error('Error saving to localStorage:', localStorageError);
            // Check if the error is due to localStorage being unavailable (e.g., in private browsing)
            if (localStorageError.name === 'SecurityError' || localStorageError.name === 'QuotaExceededError') {
              setErrorMessage('Failed to save subscription status. Please ensure local storage is enabled in your browser settings.');
            } else {
              setErrorMessage('Failed to save subscription status. Please try again.');
            }
          }
          setErrorMessage(null);
          setSuccessMessage(`Successfully ${action}d!`);
        } else {
          let errorData: ApiResponse;
          try {
            errorData = await response.json();
          } catch (jsonError) {
            console.error('Error parsing JSON error response:', jsonError);
            errorData = { message: 'An unexpected error occurred.' };
          }
          const message = errorData.message || 'Unknown error';
          setErrorMessage(`${action === 'subscribe' ? 'Subscription' : 'Unsubscription'} failed: ${message}`);

          setSuccessMessage(null);
        }
      } catch (error: any) {
        console.error(`${action === 'subscribe' ? 'Subscription' : 'Unsubscription'} error:`, error);
        let errorMessageText = 'An error occurred while processing your request. Please try again later.';

        // Handle network errors specifically
        if (error.message === 'Failed to fetch') {
          errorMessageText = 'Failed to connect to the server. Please check your internet connection and try again.';
        }

        setErrorMessage(errorMessageText);
        setSuccessMessage(null);
      } finally {
        setIsLoading(false);
      }
    },
    [email, isValidEmail, localStorageKey, subscribeEndpoint, unsubscribeEndpoint, userId]
  );

  const subscribe = useCallback(() => handleSubscription('subscribe'), [handleSubscription]);
  const unsubscribe = useCallback(() => handleSubscription('unsubscribe'), [handleSubscription]);

  return (
    <div aria-live="polite">
      <h2>Email Marketing Preferences</h2>
      {errorMessage && (
        <div style={{ color: 'red' }} role="alert">
          {errorMessage}
        </div>
      )}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      {isSubscribed ? (
        <div>
          <p>You are currently subscribed to our newsletter.</p>
          <button onClick={unsubscribe} aria-label={subscribeButtonLabel} disabled={isLoading}>
            {isLoading ? 'Unsubscribing...' : unsubscribeButtonText}
          </button>
        </div>
      ) : (
        <div>
          <p>Stay up-to-date with the latest wellness tips and MoodBoard Pro updates!</p>
          <label htmlFor="emailInput">Enter your email:</label>
          <input
            ref={emailInputRef}
            type="email"
            id="emailInput"
            placeholder={emailPlaceholder}
            value={email}
            onChange={handleEmailChange}
            aria-required="true"
            aria-invalid={!isEmailValid}
          />
          {!isEmailValid && errorMessage && (
            <p style={{ color: 'red' }} role="alert">
              {errorMessage}
            </p>
          )}
          <button onClick={subscribe} aria-label={subscribeButtonLabel} disabled={isLoading}>
            {isLoading ? 'Subscribing...' : subscribeButtonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface EmailMarketingProps {
  userId: string; // User identifier for personalization
  initialSubscriptionStatus?: boolean; // Initial subscription status
  subscribeEndpoint?: string; // API endpoint for subscribing (optional, defaults to /api/subscribe)
  unsubscribeEndpoint?: string; // API endpoint for unsubscribing (optional, defaults to /api/unsubscribe)
  localStorageKeyPrefix?: string; // Prefix for local storage key (optional, defaults to 'subscription')
  emailPlaceholder?: string; // Placeholder text for the email input field
  subscribeButtonText?: string; // Text for the subscribe button
  unsubscribeButtonText?: string; // Text for the unsubscribe button
  successMessageDuration?: number; // Duration (in ms) to display success messages. Defaults to 3000ms
}

interface ApiResponse {
  message?: string;
}

const defaultSubscribeEndpoint = '/api/subscribe';
const defaultUnsubscribeEndpoint = '/api/unsubscribe';
const defaultLocalStorageKeyPrefix = 'subscription';
const defaultEmailPlaceholder = 'Enter your email';
const defaultSubscribeButtonText = 'Subscribe';
const defaultUnsubscribeButtonText = 'Unsubscribe';
const defaultSuccessMessageDuration = 3000;

const EmailMarketing: React.FC<EmailMarketingProps> = ({
  userId,
  initialSubscriptionStatus = false,
  subscribeEndpoint = defaultSubscribeEndpoint,
  unsubscribeEndpoint = defaultUnsubscribeEndpoint,
  localStorageKeyPrefix = defaultLocalStorageKeyPrefix,
  emailPlaceholder = defaultEmailPlaceholder,
  subscribeButtonText = defaultSubscribeButtonText,
  unsubscribeButtonText = defaultUnsubscribeButtonText,
  successMessageDuration = defaultSuccessMessageDuration,
}) => {
  const [isSubscribed, setIsSubscribed] = useState(initialSubscriptionStatus);
  const [email, setEmail] = useState<string>(''); // State to hold the email address
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success messages
  const [isLoading, setIsLoading] = useState<boolean>(false); // State to indicate loading state
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true); // State to track email validity

  const localStorageKey = `${localStorageKeyPrefix}_${userId}`;
  const emailInputRef = useRef<HTMLInputElement>(null); // Ref for the email input

  // Accessibility: Aria labels for buttons
  const subscribeButtonLabel = isSubscribed ? `Unsubscribe from newsletter` : `Subscribe to newsletter`;

  // Load subscription status from local storage
  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      try {
        const storedSubscription = localStorage.getItem(localStorageKey);
        if (storedSubscription) {
          setIsSubscribed(storedSubscription === 'true');
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        setErrorMessage('Failed to load subscription status. Please try again.');
      }
    };

    loadSubscriptionStatus();
  }, [localStorageKey]);

  // Clear success message after a delay
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, successMessageDuration);

      return () => clearTimeout(timer); // Cleanup on unmount or message change
    }
  }, [successMessage, successMessageDuration]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    // Validate email on change, but don't set error message immediately
    setIsEmailValid(isValidEmail(newEmail));
  };

  // useCallback to prevent unnecessary re-renders
  const isValidEmail = useCallback((email: string): boolean => {
    if (!email) return true; // Allow empty string, validation happens on submit
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }, []);

  const handleSubscription = useCallback(
    async (action: 'subscribe' | 'unsubscribe') => {
      if (action === 'subscribe') {
        if (!email) {
          setErrorMessage('Please enter your email address.');
          setSuccessMessage(null);
          setIsEmailValid(false); // Set invalid state for accessibility
          if (emailInputRef.current) {
            emailInputRef.current.focus(); // Focus the input for immediate correction
          }
          return;
        }

        if (!isValidEmail(email)) {
          setErrorMessage('Please enter a valid email address.');
          setSuccessMessage(null);
          setIsEmailValid(false); // Set invalid state for accessibility
          if (emailInputRef.current) {
            emailInputRef.current.focus(); // Focus the input for immediate correction
          }
          return;
        }
      }

      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsEmailValid(true); // Reset email validity on submission

      const endpoint = action === 'subscribe' ? subscribeEndpoint : unsubscribeEndpoint;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, email }),
        });

        if (response.ok) {
          const newSubscriptionStatus = action === 'subscribe';
          setIsSubscribed(newSubscriptionStatus);
          try {
            localStorage.setItem(localStorageKey, String(newSubscriptionStatus));
          } catch (localStorageError: any) {
            console.error('Error saving to localStorage:', localStorageError);
            // Check if the error is due to localStorage being unavailable (e.g., in private browsing)
            if (localStorageError.name === 'SecurityError' || localStorageError.name === 'QuotaExceededError') {
              setErrorMessage('Failed to save subscription status. Please ensure local storage is enabled in your browser settings.');
            } else {
              setErrorMessage('Failed to save subscription status. Please try again.');
            }
          }
          setErrorMessage(null);
          setSuccessMessage(`Successfully ${action}d!`);
        } else {
          let errorData: ApiResponse;
          try {
            errorData = await response.json();
          } catch (jsonError) {
            console.error('Error parsing JSON error response:', jsonError);
            errorData = { message: 'An unexpected error occurred.' };
          }
          const message = errorData.message || 'Unknown error';
          setErrorMessage(`${action === 'subscribe' ? 'Subscription' : 'Unsubscription'} failed: ${message}`);

          setSuccessMessage(null);
        }
      } catch (error: any) {
        console.error(`${action === 'subscribe' ? 'Subscription' : 'Unsubscription'} error:`, error);
        let errorMessageText = 'An error occurred while processing your request. Please try again later.';

        // Handle network errors specifically
        if (error.message === 'Failed to fetch') {
          errorMessageText = 'Failed to connect to the server. Please check your internet connection and try again.';
        }

        setErrorMessage(errorMessageText);
        setSuccessMessage(null);
      } finally {
        setIsLoading(false);
      }
    },
    [email, isValidEmail, localStorageKey, subscribeEndpoint, unsubscribeEndpoint, userId]
  );

  const subscribe = useCallback(() => handleSubscription('subscribe'), [handleSubscription]);
  const unsubscribe = useCallback(() => handleSubscription('unsubscribe'), [handleSubscription]);

  return (
    <div aria-live="polite">
      <h2>Email Marketing Preferences</h2>
      {errorMessage && (
        <div style={{ color: 'red' }} role="alert">
          {errorMessage}
        </div>
      )}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      {isSubscribed ? (
        <div>
          <p>You are currently subscribed to our newsletter.</p>
          <button onClick={unsubscribe} aria-label={subscribeButtonLabel} disabled={isLoading}>
            {isLoading ? 'Unsubscribing...' : unsubscribeButtonText}
          </button>
        </div>
      ) : (
        <div>
          <p>Stay up-to-date with the latest wellness tips and MoodBoard Pro updates!</p>
          <label htmlFor="emailInput">Enter your email:</label>
          <input
            ref={emailInputRef}
            type="email"
            id="emailInput"
            placeholder={emailPlaceholder}
            value={email}
            onChange={handleEmailChange}
            aria-required="true"
            aria-invalid={!isEmailValid}
          />
          {!isEmailValid && errorMessage && (
            <p style={{ color: 'red' }} role="alert">
              {errorMessage}
            </p>
          )}
          <button onClick={subscribe} aria-label={subscribeButtonLabel} disabled={isLoading}>
            {isLoading ? 'Subscribing...' : subscribeButtonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;