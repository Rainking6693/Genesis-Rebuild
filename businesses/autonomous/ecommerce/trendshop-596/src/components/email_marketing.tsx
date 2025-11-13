// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { validateEmail } from '../utils/validation'; // Assuming a validation utility
import { subscribeUser } from '../services/emailService'; // Assuming an email service API

interface EmailMarketingProps {
  // Add any necessary props here
}

const EmailMarketing: React.FC<EmailMarketingProps> = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already subscribed (e.g., from local storage or cookies)
    // This is a placeholder - replace with actual logic
    const storedSubscriptionStatus = localStorage.getItem('emailSubscription');
    if (storedSubscriptionStatus === 'true') {
      setIsSubscribed(true);
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const result = await subscribeUser(email); // Call the email service API
      if (result.success) {
        setIsSubscribed(true);
        localStorage.setItem('emailSubscription', 'true'); // Store subscription status
        setEmail(''); // Clear the input field
      } else {
        setError(result.message || 'An error occurred while subscribing.');
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-marketing">
      {!isSubscribed ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Subscribe to our newsletter:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Your email address"
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      ) : (
        <div className="success">Thank you for subscribing!</div>
      )}
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { validateEmail } from '../utils/validation'; // Assuming a validation utility
import { subscribeUser } from '../services/emailService'; // Assuming an email service API

interface EmailMarketingProps {
  // Add any necessary props here
}

const EmailMarketing: React.FC<EmailMarketingProps> = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already subscribed (e.g., from local storage or cookies)
    // This is a placeholder - replace with actual logic
    const storedSubscriptionStatus = localStorage.getItem('emailSubscription');
    if (storedSubscriptionStatus === 'true') {
      setIsSubscribed(true);
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null); // Clear any previous errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      const result = await subscribeUser(email); // Call the email service API
      if (result.success) {
        setIsSubscribed(true);
        localStorage.setItem('emailSubscription', 'true'); // Store subscription status
        setEmail(''); // Clear the input field
      } else {
        setError(result.message || 'An error occurred while subscribing.');
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-marketing">
      {!isSubscribed ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Subscribe to our newsletter:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Your email address"
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      ) : (
        <div className="success">Thank you for subscribing!</div>
      )}
    </div>
  );
};

export default EmailMarketing;