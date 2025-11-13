import React, { useState, useEffect, useCallback, useRef } from 'react';

interface NewsletterSignupProps {
  formId: string; // Unique identifier for the form (e.g., 'homepage', 'footer')
  headline?: string; // Optional headline for the newsletter signup section
  description?: string; // Optional description explaining the benefits of subscribing
  submitButtonText?: string; // Customizable text for the submit button
  successMessage?: string; // Message displayed upon successful signup
  errorMessage?: string; // Message displayed upon signup failure
  apiEndpoint?: string; // Customizable API endpoint for signup
  validateEmail?: (email: string) => boolean; // Custom email validation function
  localStorageKeyPrefix?: string; // Prefix for local storage key to avoid conflicts
  successTimeout?: number; // Time in milliseconds to display the success message
}

const defaultEmailValidation = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  formId,
  headline = 'Stay Updated with Climate-Tech Insights',
  description = 'Subscribe to our newsletter for the latest climate-tech solutions, case studies, and no-code automation tips to grow your business sustainably.',
  submitButtonText = 'Subscribe',
  successMessage = 'Thank you for subscribing! Check your inbox for a confirmation email.',
  errorMessage = 'Oops! Something went wrong. Please try again later.',
  apiEndpoint = '/api/newsletter-signup',
  validateEmail = defaultEmailValidation,
  localStorageKeyPrefix = 'newsletterSubscribed',
  successTimeout = 5000, // Default timeout of 5 seconds
}) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for controlling success message visibility
  const localStorageKey = `${localStorageKeyPrefix}_${formId}`;
  const successTimeoutRef = useRef<number | null>(null); // useRef to hold the timeout ID

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const resetForm = useCallback(() => {
    setEmail('');
    setIsLoading(false);
    setError(null);
  }, []);

  // Use useCallback to memoize the handleSubmit function
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, formId }),
        });

        if (!response.ok) {
          let errorData: { message?: string; errors?: string[] } = {}; // Added errors array
          try {
            errorData = await response.json();
          } catch (jsonError) {
            console.error('Error parsing JSON error response:', jsonError);
            setError(errorMessage);
            return;
          }

          // Prioritize specific error messages from the API
          if (errorData.message) {
            setError(errorData.message);
          } else if (errorData.errors && errorData.errors.length > 0) {
            setError(errorData.errors[0]); // Display the first error
          } else {
            setError(errorMessage);
          }
          return;
        }

        setIsSubscribed(true);
        localStorage.setItem(localStorageKey, 'true');
        setShowSuccessMessage(true); // Show the success message

        // Set a timeout to hide the success message after a certain duration
        successTimeoutRef.current = window.setTimeout(() => {
          setShowSuccessMessage(false);
        }, successTimeout);

        resetForm(); // Clear the form after successful submission

      } catch (err) {
        console.error('Newsletter signup error:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [
      email,
      formId,
      apiEndpoint,
      validateEmail,
      errorMessage,
      localStorageKey,
      successTimeout,
      resetForm,
    ]
  );

  // Use useCallback to memoize the setEmail function
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null); // Clear the error when the user starts typing again
  }, []);

  useEffect(() => {
    let isMounted = true; // Add a flag to prevent setting state on unmounted component

    try {
      const subscribed = localStorage.getItem(localStorageKey);
      if (subscribed === 'true' && isMounted) {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Handle the error gracefully, e.g., by not setting isSubscribed to true
      // Consider using a fallback mechanism if localStorage is unavailable
    }

    return () => {
      isMounted = false; // Set the flag to false when the component unmounts
    };
  }, [localStorageKey]);

  if (showSuccessMessage) {
    return (
      <div className="newsletter-success" role="alert" aria-live="polite">
        {successMessage}
      </div>
    );
  }

  return (
    <div className="newsletter-signup">
      <h3>{headline}</h3>
      <p>{description}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="emailInput">Your email address</label>
        <input
          type="email"
          id="emailInput"
          placeholder="Your email address"
          value={email}
          onChange={handleEmailChange}
          required
          aria-label="Email address"
          aria-invalid={!!error}
          disabled={isLoading} // Disable input while loading
        />
        <button type="submit" disabled={isLoading} aria-busy={isLoading}>
          {isLoading ? 'Subscribing...' : submitButtonText}
        </button>
      </form>
      {error && (
        <div className="newsletter-error" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
    </div>
  );
};

export default NewsletterSignup;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface NewsletterSignupProps {
  formId: string; // Unique identifier for the form (e.g., 'homepage', 'footer')
  headline?: string; // Optional headline for the newsletter signup section
  description?: string; // Optional description explaining the benefits of subscribing
  submitButtonText?: string; // Customizable text for the submit button
  successMessage?: string; // Message displayed upon successful signup
  errorMessage?: string; // Message displayed upon signup failure
  apiEndpoint?: string; // Customizable API endpoint for signup
  validateEmail?: (email: string) => boolean; // Custom email validation function
  localStorageKeyPrefix?: string; // Prefix for local storage key to avoid conflicts
  successTimeout?: number; // Time in milliseconds to display the success message
}

const defaultEmailValidation = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  formId,
  headline = 'Stay Updated with Climate-Tech Insights',
  description = 'Subscribe to our newsletter for the latest climate-tech solutions, case studies, and no-code automation tips to grow your business sustainably.',
  submitButtonText = 'Subscribe',
  successMessage = 'Thank you for subscribing! Check your inbox for a confirmation email.',
  errorMessage = 'Oops! Something went wrong. Please try again later.',
  apiEndpoint = '/api/newsletter-signup',
  validateEmail = defaultEmailValidation,
  localStorageKeyPrefix = 'newsletterSubscribed',
  successTimeout = 5000, // Default timeout of 5 seconds
}) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for controlling success message visibility
  const localStorageKey = `${localStorageKeyPrefix}_${formId}`;
  const successTimeoutRef = useRef<number | null>(null); // useRef to hold the timeout ID

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const resetForm = useCallback(() => {
    setEmail('');
    setIsLoading(false);
    setError(null);
  }, []);

  // Use useCallback to memoize the handleSubmit function
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, formId }),
        });

        if (!response.ok) {
          let errorData: { message?: string; errors?: string[] } = {}; // Added errors array
          try {
            errorData = await response.json();
          } catch (jsonError) {
            console.error('Error parsing JSON error response:', jsonError);
            setError(errorMessage);
            return;
          }

          // Prioritize specific error messages from the API
          if (errorData.message) {
            setError(errorData.message);
          } else if (errorData.errors && errorData.errors.length > 0) {
            setError(errorData.errors[0]); // Display the first error
          } else {
            setError(errorMessage);
          }
          return;
        }

        setIsSubscribed(true);
        localStorage.setItem(localStorageKey, 'true');
        setShowSuccessMessage(true); // Show the success message

        // Set a timeout to hide the success message after a certain duration
        successTimeoutRef.current = window.setTimeout(() => {
          setShowSuccessMessage(false);
        }, successTimeout);

        resetForm(); // Clear the form after successful submission

      } catch (err) {
        console.error('Newsletter signup error:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [
      email,
      formId,
      apiEndpoint,
      validateEmail,
      errorMessage,
      localStorageKey,
      successTimeout,
      resetForm,
    ]
  );

  // Use useCallback to memoize the setEmail function
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null); // Clear the error when the user starts typing again
  }, []);

  useEffect(() => {
    let isMounted = true; // Add a flag to prevent setting state on unmounted component

    try {
      const subscribed = localStorage.getItem(localStorageKey);
      if (subscribed === 'true' && isMounted) {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Handle the error gracefully, e.g., by not setting isSubscribed to true
      // Consider using a fallback mechanism if localStorage is unavailable
    }

    return () => {
      isMounted = false; // Set the flag to false when the component unmounts
    };
  }, [localStorageKey]);

  if (showSuccessMessage) {
    return (
      <div className="newsletter-success" role="alert" aria-live="polite">
        {successMessage}
      </div>
    );
  }

  return (
    <div className="newsletter-signup">
      <h3>{headline}</h3>
      <p>{description}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="emailInput">Your email address</label>
        <input
          type="email"
          id="emailInput"
          placeholder="Your email address"
          value={email}
          onChange={handleEmailChange}
          required
          aria-label="Email address"
          aria-invalid={!!error}
          disabled={isLoading} // Disable input while loading
        />
        <button type="submit" disabled={isLoading} aria-busy={isLoading}>
          {isLoading ? 'Subscribing...' : submitButtonText}
        </button>
      </form>
      {error && (
        <div className="newsletter-error" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
    </div>
  );
};

export default NewsletterSignup;