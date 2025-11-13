// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { trackEvent } from '../utils/analytics'; // Assuming you have an analytics utility
import { subscribeToMailingList } from '../api/emailService'; // Assuming you have an API endpoint

interface EmailMarketingProps {
  listId: string; // ID of the mailing list to subscribe to
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ listId }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already subscribed (e.g., using localStorage)
    const isSubscribed = localStorage.getItem(`subscribed-${listId}`) === 'true';
    setSubscribed(isSubscribed);
  }, [listId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await subscribeToMailingList(email, listId);

      if (result.success) {
        setSubscribed(true);
        localStorage.setItem(`subscribed-${listId}`, 'true');
        trackEvent('email_subscription', { listId }); // Track the subscription event
      } else {
        setError(result.error || 'An error occurred while subscribing.');
      }
    } catch (err: any) {
      console.error('Error subscribing:', err);
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!subscribed ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Subscribe to our newsletter:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      ) : (
        <p>Thank you for subscribing!</p>
      )}
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import { trackEvent } from '../utils/analytics'; // Assuming you have an analytics utility
import { subscribeToMailingList } from '../api/emailService'; // Assuming you have an API endpoint

interface EmailMarketingProps {
  listId: string; // ID of the mailing list to subscribe to
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ listId }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already subscribed (e.g., using localStorage)
    const isSubscribed = localStorage.getItem(`subscribed-${listId}`) === 'true';
    setSubscribed(isSubscribed);
  }, [listId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await subscribeToMailingList(email, listId);

      if (result.success) {
        setSubscribed(true);
        localStorage.setItem(`subscribed-${listId}`, 'true');
        trackEvent('email_subscription', { listId }); // Track the subscription event
      } else {
        setError(result.error || 'An error occurred while subscribing.');
      }
    } catch (err: any) {
      console.error('Error subscribing:', err);
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!subscribed ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Subscribe to our newsletter:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      ) : (
        <p>Thank you for subscribing!</p>
      )}
    </div>
  );
};

export default EmailMarketing;