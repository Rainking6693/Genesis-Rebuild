// src/components/EmailMarketing.tsx
import React, { useState, useEffect, useCallback } from 'react';

interface EmailMarketingProps {
  // Add any necessary props here, e.g., API keys, campaign IDs
}

const EmailMarketing: React.FC<EmailMarketingProps> = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Simulate API call to email service provider
      // Replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency

      if (!isValidEmail(email)) {
        throw new Error("Invalid email format.");
      }

      // Simulate successful subscription
      console.log(`Subscribing email: ${email}`);
      setSubscribed(true);

    } catch (error: any) {
      console.error("Subscription failed:", error);
      setErrorMessage(error.message || "Subscription failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    // Load subscription status from local storage or API
    // Example:
    // const storedSubscription = localStorage.getItem('subscribed');
    // if (storedSubscription === 'true') {
    //   setSubscribed(true);
    // }
  }, []);

  if (subscribed) {
    return (
      <div>
        <p>Thank you for subscribing!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Stay Updated with Our Latest Offers</h2>
      <p>Subscribe to our newsletter and get exclusive deals.</p>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={handleEmailChange}
        disabled={isLoading}
      />
      <button onClick={subscribe} disabled={isLoading}>
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect, useCallback } from 'react';

interface EmailMarketingProps {
  // Add any necessary props here, e.g., API keys, campaign IDs
}

const EmailMarketing: React.FC<EmailMarketingProps> = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Simulate API call to email service provider
      // Replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency

      if (!isValidEmail(email)) {
        throw new Error("Invalid email format.");
      }

      // Simulate successful subscription
      console.log(`Subscribing email: ${email}`);
      setSubscribed(true);

    } catch (error: any) {
      console.error("Subscription failed:", error);
      setErrorMessage(error.message || "Subscription failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  const isValidEmail = (email: string): boolean => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    // Load subscription status from local storage or API
    // Example:
    // const storedSubscription = localStorage.getItem('subscribed');
    // if (storedSubscription === 'true') {
    //   setSubscribed(true);
    // }
  }, []);

  if (subscribed) {
    return (
      <div>
        <p>Thank you for subscribing!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Stay Updated with Our Latest Offers</h2>
      <p>Subscribe to our newsletter and get exclusive deals.</p>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={handleEmailChange}
        disabled={isLoading}
      />
      <button onClick={subscribe} disabled={isLoading}>
        {isLoading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </div>
  );
};

export default EmailMarketing;

Now, I'll use the `Write` tool to save the code to a file and the build report to another file.