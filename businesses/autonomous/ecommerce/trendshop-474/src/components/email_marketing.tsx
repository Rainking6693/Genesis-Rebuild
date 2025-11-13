// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  // Define props if needed, e.g., API endpoint for subscriptions
  apiUrl?: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiUrl }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already subscribed (e.g., from local storage or API)
    // This is a placeholder, replace with actual logic
    const storedSubscriptionStatus = localStorage.getItem('subscribed');
    if (storedSubscriptionStatus === 'true') {
      setSubscribed(true);
    }
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const subscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate an API call to subscribe the user
      // Replace with your actual API endpoint and logic
      if (!apiUrl) {
        throw new Error("API URL is not defined.");
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Subscription failed');
      }

      setSubscribed(true);
      localStorage.setItem('subscribed', 'true'); // Store subscription status
      setEmail('');

    } catch (err: any) {
      setError(err.message || 'An error occurred during subscription.');
      console.error("Subscription error:", err); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = () => {
    // Implement unsubscribe logic (e.g., API call to unsubscribe)
    // This is a placeholder, replace with actual logic
    setSubscribed(false);
    localStorage.removeItem('subscribed'); // Remove subscription status
  };

  return (
    <div>
      <h2>Stay Updated with Our Newsletter!</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {subscribed ? (
        <p>
          You are subscribed! Thank you. <button onClick={unsubscribe}>Unsubscribe</button>
        </p>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            disabled={loading}
          />
          <button onClick={subscribe} disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';

interface EmailMarketingProps {
  // Define props if needed, e.g., API endpoint for subscriptions
  apiUrl?: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiUrl }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already subscribed (e.g., from local storage or API)
    // This is a placeholder, replace with actual logic
    const storedSubscriptionStatus = localStorage.getItem('subscribed');
    if (storedSubscriptionStatus === 'true') {
      setSubscribed(true);
    }
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const subscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate an API call to subscribe the user
      // Replace with your actual API endpoint and logic
      if (!apiUrl) {
        throw new Error("API URL is not defined.");
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Subscription failed');
      }

      setSubscribed(true);
      localStorage.setItem('subscribed', 'true'); // Store subscription status
      setEmail('');

    } catch (err: any) {
      setError(err.message || 'An error occurred during subscription.');
      console.error("Subscription error:", err); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = () => {
    // Implement unsubscribe logic (e.g., API call to unsubscribe)
    // This is a placeholder, replace with actual logic
    setSubscribed(false);
    localStorage.removeItem('subscribed'); // Remove subscription status
  };

  return (
    <div>
      <h2>Stay Updated with Our Newsletter!</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {subscribed ? (
        <p>
          You are subscribed! Thank you. <button onClick={unsubscribe}>Unsubscribe</button>
        </p>
      ) : (
        <div>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
            disabled={loading}
          />
          <button onClick={subscribe} disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailMarketing;