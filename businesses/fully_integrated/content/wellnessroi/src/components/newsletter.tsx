import React, { useState, useEffect, useCallback, useRef } from 'react';

interface NewsletterSignupProps {
  formId: string; // Unique identifier for the form (e.g., 'newsletter-signup-footer')
  onSubmit?: (email: string) => Promise<void> | void; // Optional callback for form submission (can be async)
  successMessage?: string; // Optional message to display on successful signup
  errorMessage?: string; // Optional message to display on error
  validateEmail?: (email: string) => boolean; // Optional custom email validation function
  loadingMessage?: string; // Optional message to display while loading
  initialEmailValue?: string; // Optional initial value for the email input
  disableLocalStorage?: boolean; // Optional flag to disable local storage usage
}

const defaultValidateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  formId,
  onSubmit,
  successMessage = 'Thank you for subscribing!',
  errorMessage = 'An error occurred. Please try again later.',
  validateEmail = defaultValidateEmail,
  loadingMessage = 'Subscribing...',
  initialEmailValue = '',
  disableLocalStorage = false,
}) => {
  const [email, setEmail] = useState(initialEmailValue);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const isMounted = useRef(false); // Track if the component is mounted

  // Use useCallback to memoize the email validation function
  const isValidEmail = useCallback(
    (emailToCheck: string): boolean => {
      return validateEmail(emailToCheck);
    },
    [validateEmail]
  );

  // Load subscription status from local storage on component mount
  useEffect(() => {
    isMounted.current = true; // Set mounted to true
    if (disableLocalStorage) return;

    try {
      const storedSubscription = localStorage.getItem(`newsletterSubscribed-${formId}`);
      if (storedSubscription === 'true') {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Handle the error gracefully, e.g., by not setting isSubscribed to true
    }

    return () => {
      isMounted.current = false; // Set mounted to false on unmount
    };
  }, [formId, disableLocalStorage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation with custom validator
    if (!email) {
      setValidationError('Please enter your email address.');
      return;
    }

    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setValidationError(null); // Clear previous validation error

    setIsLoading(true);
    setIsError(false); // Reset error state

    try {
      // Simulate API call (replace with actual API endpoint)
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network latency

      // Call the optional onSubmit callback if provided
      if (onSubmit) {
        await onSubmit(email); // Await the onSubmit promise if it returns one
      }

      if (isMounted.current) {
        setIsSubscribed(true);
      }

      if (!disableLocalStorage) {
        try {
          localStorage.setItem(`newsletterSubscribed-${formId}`, 'true'); // Store subscription status
        } catch (localStorageError) {
          console.error('Error saving to localStorage:', localStorageError);
          // Consider showing a message to the user that their subscription status might not be persisted.
        }
      }

      if (isMounted.current) {
        setEmail(''); // Clear the input field
      }
    } catch (error: any) {
      console.error('Newsletter signup error:', error);
      if (isMounted.current) {
        setIsError(true);
        setIsSubscribed(false); // Ensure isSubscribed is false in case of error
      }

      if (!disableLocalStorage) {
        try {
          localStorage.removeItem(`newsletterSubscribed-${formId}`); // Remove potentially incorrect subscription status
        } catch (localStorageError) {
          console.error('Error removing from localStorage:', localStorageError);
          // Handle the error, perhaps by ignoring it or logging it.
        }
      }

      // Provide more specific error messages based on the error type
      let displayError = errorMessage;
      if (error instanceof Error) {
        // Example: Check for specific error messages from the API
        if (error.message === 'Email already subscribed') {
          displayError = 'This email is already subscribed.';
        }
      }

      if (isMounted.current) {
        setValidationError(displayError);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setValidationError(null); // Clear validation error on input change
  };

  if (isSubscribed) {
    return (
      <div role="alert" aria-live="polite" className="text-green-500">
        {successMessage}
      </div>
    ); // Tailwind class for success message, added role for accessibility
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col space-y-2">
      {/* Tailwind classes for layout */}
      <label htmlFor="email" className="text-sm font-medium text-gray-700">
        {/* Tailwind classes for label */}
        Stay updated with the latest wellness insights:
      </label>
      <input
        type="email"
        id="email"
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" // Tailwind classes for input
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
        required
        aria-label="Email address"
        aria-invalid={validationError ? 'true' : 'false'} // Indicate invalid state for accessibility
        disabled={isLoading}
      />
      {validationError && (
        <p role="alert" className="text-red-500">
          {validationError}
        </p>
      )}
      {isError && (
        <p role="alert" className="text-red-500">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`} // Tailwind classes for button
        disabled={isLoading}
        aria-busy={isLoading} // Indicate loading state for assistive technologies
      >
        {isLoading ? loadingMessage : 'Subscribe'}
      </button>
    </form>
  );
};

export default NewsletterSignup;

import React, { useState, useEffect, useCallback, useRef } from 'react';

interface NewsletterSignupProps {
  formId: string; // Unique identifier for the form (e.g., 'newsletter-signup-footer')
  onSubmit?: (email: string) => Promise<void> | void; // Optional callback for form submission (can be async)
  successMessage?: string; // Optional message to display on successful signup
  errorMessage?: string; // Optional message to display on error
  validateEmail?: (email: string) => boolean; // Optional custom email validation function
  loadingMessage?: string; // Optional message to display while loading
  initialEmailValue?: string; // Optional initial value for the email input
  disableLocalStorage?: boolean; // Optional flag to disable local storage usage
}

const defaultValidateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  formId,
  onSubmit,
  successMessage = 'Thank you for subscribing!',
  errorMessage = 'An error occurred. Please try again later.',
  validateEmail = defaultValidateEmail,
  loadingMessage = 'Subscribing...',
  initialEmailValue = '',
  disableLocalStorage = false,
}) => {
  const [email, setEmail] = useState(initialEmailValue);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const isMounted = useRef(false); // Track if the component is mounted

  // Use useCallback to memoize the email validation function
  const isValidEmail = useCallback(
    (emailToCheck: string): boolean => {
      return validateEmail(emailToCheck);
    },
    [validateEmail]
  );

  // Load subscription status from local storage on component mount
  useEffect(() => {
    isMounted.current = true; // Set mounted to true
    if (disableLocalStorage) return;

    try {
      const storedSubscription = localStorage.getItem(`newsletterSubscribed-${formId}`);
      if (storedSubscription === 'true') {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      // Handle the error gracefully, e.g., by not setting isSubscribed to true
    }

    return () => {
      isMounted.current = false; // Set mounted to false on unmount
    };
  }, [formId, disableLocalStorage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation with custom validator
    if (!email) {
      setValidationError('Please enter your email address.');
      return;
    }

    if (!isValidEmail(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setValidationError(null); // Clear previous validation error

    setIsLoading(true);
    setIsError(false); // Reset error state

    try {
      // Simulate API call (replace with actual API endpoint)
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network latency

      // Call the optional onSubmit callback if provided
      if (onSubmit) {
        await onSubmit(email); // Await the onSubmit promise if it returns one
      }

      if (isMounted.current) {
        setIsSubscribed(true);
      }

      if (!disableLocalStorage) {
        try {
          localStorage.setItem(`newsletterSubscribed-${formId}`, 'true'); // Store subscription status
        } catch (localStorageError) {
          console.error('Error saving to localStorage:', localStorageError);
          // Consider showing a message to the user that their subscription status might not be persisted.
        }
      }

      if (isMounted.current) {
        setEmail(''); // Clear the input field
      }
    } catch (error: any) {
      console.error('Newsletter signup error:', error);
      if (isMounted.current) {
        setIsError(true);
        setIsSubscribed(false); // Ensure isSubscribed is false in case of error
      }

      if (!disableLocalStorage) {
        try {
          localStorage.removeItem(`newsletterSubscribed-${formId}`); // Remove potentially incorrect subscription status
        } catch (localStorageError) {
          console.error('Error removing from localStorage:', localStorageError);
          // Handle the error, perhaps by ignoring it or logging it.
        }
      }

      // Provide more specific error messages based on the error type
      let displayError = errorMessage;
      if (error instanceof Error) {
        // Example: Check for specific error messages from the API
        if (error.message === 'Email already subscribed') {
          displayError = 'This email is already subscribed.';
        }
      }

      if (isMounted.current) {
        setValidationError(displayError);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setValidationError(null); // Clear validation error on input change
  };

  if (isSubscribed) {
    return (
      <div role="alert" aria-live="polite" className="text-green-500">
        {successMessage}
      </div>
    ); // Tailwind class for success message, added role for accessibility
  }

  return (
    <form id={formId} onSubmit={handleSubmit} className="flex flex-col space-y-2">
      {/* Tailwind classes for layout */}
      <label htmlFor="email" className="text-sm font-medium text-gray-700">
        {/* Tailwind classes for label */}
        Stay updated with the latest wellness insights:
      </label>
      <input
        type="email"
        id="email"
        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" // Tailwind classes for input
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
        required
        aria-label="Email address"
        aria-invalid={validationError ? 'true' : 'false'} // Indicate invalid state for accessibility
        disabled={isLoading}
      />
      {validationError && (
        <p role="alert" className="text-red-500">
          {validationError}
        </p>
      )}
      {isError && (
        <p role="alert" className="text-red-500">
          {errorMessage}
        </p>
      )}
      <button
        type="submit"
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`} // Tailwind classes for button
        disabled={isLoading}
        aria-busy={isLoading} // Indicate loading state for assistive technologies
      >
        {isLoading ? loadingMessage : 'Subscribe'}
      </button>
    </form>
  );
};

export default NewsletterSignup;