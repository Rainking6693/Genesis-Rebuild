// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface EmailMarketingProps {
  apiKey: string; // API key for email service provider (e.g., SendGrid, Mailchimp)
  listId: string; // ID of the mailing list
}

interface SubscriptionStatus {
  subscribed: boolean;
  message: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiKey, listId }) => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({ subscribed: false, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Simulate API call to subscribe the user (replace with actual API call)
      const response = await axios.post('/api/subscribe', {
        email: email,
        apiKey: apiKey,
        listId: listId,
      });

      if (response.status === 200) {
        setSubscriptionStatus({ subscribed: true, message: 'Successfully subscribed!' });
      } else {
        setSubscriptionStatus({ subscribed: false, message: 'Subscription failed.' });
      }
    } catch (error: any) {
      console.error('Error subscribing:', error);
      setSubscriptionStatus({ subscribed: false, message: `Subscription failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if the user is already subscribed (e.g., using local storage or cookies)
    // This is a placeholder - implement actual logic here
    const isSubscribed = localStorage.getItem('subscribed') === 'true';
    if (isSubscribed) {
      setSubscriptionStatus({ subscribed: true, message: 'You are already subscribed.' });
    }
  }, []);

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      {subscriptionStatus.message && <p>{subscriptionStatus.message}</p>}
      {!subscriptionStatus.subscribed && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubscribe} disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </>
      )}
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface EmailMarketingProps {
  apiKey: string; // API key for email service provider (e.g., SendGrid, Mailchimp)
  listId: string; // ID of the mailing list
}

interface SubscriptionStatus {
  subscribed: boolean;
  message: string;
}

const EmailMarketing: React.FC<EmailMarketingProps> = ({ apiKey, listId }) => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({ subscribed: false, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Simulate API call to subscribe the user (replace with actual API call)
      const response = await axios.post('/api/subscribe', {
        email: email,
        apiKey: apiKey,
        listId: listId,
      });

      if (response.status === 200) {
        setSubscriptionStatus({ subscribed: true, message: 'Successfully subscribed!' });
      } else {
        setSubscriptionStatus({ subscribed: false, message: 'Subscription failed.' });
      }
    } catch (error: any) {
      console.error('Error subscribing:', error);
      setSubscriptionStatus({ subscribed: false, message: `Subscription failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if the user is already subscribed (e.g., using local storage or cookies)
    // This is a placeholder - implement actual logic here
    const isSubscribed = localStorage.getItem('subscribed') === 'true';
    if (isSubscribed) {
      setSubscriptionStatus({ subscribed: true, message: 'You are already subscribed.' });
    }
  }, []);

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      {subscriptionStatus.message && <p>{subscriptionStatus.message}</p>}
      {!subscriptionStatus.subscribed && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubscribe} disabled={loading}>
            {loading ? 'Subscribing...' : 'Subscribe'}
          </button>
        </>
      )}
    </div>
  );
};

export default EmailMarketing;