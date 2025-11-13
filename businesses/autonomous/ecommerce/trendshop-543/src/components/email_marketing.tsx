// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { subscribeUser } from './emailService'; // Assume this file exists and handles API calls
import { ErrorBoundary } from 'react-error-boundary';

interface EmailMarketingProps {
  // Add any props needed for configuration, e.g., API keys, campaign IDs
  apiKey: string;
  campaignId: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiKey, campaignId }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already subscribed (e.g., from local storage or cookies)
    // This is a placeholder; implement actual logic here
    const isSubscribed = localStorage.getItem('emailSubscribed') === 'true';
    setSubscribed(isSubscribed);
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Basic email validation
      if (!email.includes('@')) {
        throw new Error('Invalid email address');
      }

      const result = await subscribeUser(email, apiKey, campaignId);

      if (result.success) {
        setSubscribed(true);
        localStorage.setItem('emailSubscribed', 'true'); // Store subscription status
      } else {
        throw new Error(result.message || 'Subscription failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const ErrorFallback = ({ error }: { error: Error }) => (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div>
        {!subscribed ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Subscribe to our newsletter:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Your email address"
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          </form>
        ) : (
          <p>Thank you for subscribing!</p>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default EmailMarketing;

// src/emailService.ts
// Placeholder for actual API call to an email service provider

interface SubscriptionResult {
    success: boolean;
    message?: string;
}

export async function subscribeUser(email: string, apiKey: string, campaignId: string): Promise<SubscriptionResult> {
    // Simulate an API call (replace with actual API call to your ESP)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success or failure
            const randomValue = Math.random();
            if (randomValue > 0.2) { // 80% chance of success
                resolve({ success: true });
            } else {
                reject({ success: false, message: "Failed to subscribe due to a simulated error." });
            }
        }, 500); // Simulate network latency
    });
}

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { subscribeUser } from './emailService'; // Assume this file exists and handles API calls
import { ErrorBoundary } from 'react-error-boundary';

interface EmailMarketingProps {
  // Add any props needed for configuration, e.g., API keys, campaign IDs
  apiKey: string;
  campaignId: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiKey, campaignId }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already subscribed (e.g., from local storage or cookies)
    // This is a placeholder; implement actual logic here
    const isSubscribed = localStorage.getItem('emailSubscribed') === 'true';
    setSubscribed(isSubscribed);
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Basic email validation
      if (!email.includes('@')) {
        throw new Error('Invalid email address');
      }

      const result = await subscribeUser(email, apiKey, campaignId);

      if (result.success) {
        setSubscribed(true);
        localStorage.setItem('emailSubscribed', 'true'); // Store subscription status
      } else {
        throw new Error(result.message || 'Subscription failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const ErrorFallback = ({ error }: { error: Error }) => (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div>
        {!subscribed ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Subscribe to our newsletter:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Your email address"
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          </form>
        ) : (
          <p>Thank you for subscribing!</p>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default EmailMarketing;

// src/emailService.ts
// Placeholder for actual API call to an email service provider

interface SubscriptionResult {
    success: boolean;
    message?: string;
}

export async function subscribeUser(email: string, apiKey: string, campaignId: string): Promise<SubscriptionResult> {
    // Simulate an API call (replace with actual API call to your ESP)
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success or failure
            const randomValue = Math.random();
            if (randomValue > 0.2) { // 80% chance of success
                resolve({ success: true });
            } else {
                reject({ success: false, message: "Failed to subscribe due to a simulated error." });
            }
        }, 500); // Simulate network latency
    });
}