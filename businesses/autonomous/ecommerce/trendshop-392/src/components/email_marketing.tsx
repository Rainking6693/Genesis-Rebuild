// src/components/EmailMarketing.tsx

import { useState, useEffect } from 'react';

interface EmailMarketingProps {
  apiKey: string; // API key for email marketing service (e.g., SendGrid, Mailchimp)
  listId: string; // ID of the mailing list
}

interface SubscriptionStatus {
  subscribed: boolean;
  error: string | null;
  loading: boolean;
}

const EmailMarketing = ({ apiKey, listId }: EmailMarketingProps) => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    error: null,
    loading: false,
  });

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const subscribe = async () => {
    setSubscriptionStatus({ ...subscriptionStatus, loading: true });
    try {
      // Simulate API call to email marketing service
      // Replace with actual API call using fetch or a dedicated library
      const response = await fetch('/api/subscribe', { // Assuming an API endpoint exists
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          apiKey: apiKey,
          listId: listId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Subscription failed');
      }

      setSubscriptionStatus({ subscribed: true, error: null, loading: false });
    } catch (error: any) {
      console.error('Subscription error:', error);
      setSubscriptionStatus({ subscribed: false, error: error.message, loading: false });
    }
  };

  const unsubscribe = async () => {
    setSubscriptionStatus({ ...subscriptionStatus, loading: true });
    try {
      // Simulate API call to email marketing service
      // Replace with actual API call using fetch or a dedicated library
      const response = await fetch('/api/unsubscribe', { // Assuming an API endpoint exists
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          apiKey: apiKey,
          listId: listId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unsubscription failed');
      }

      setSubscriptionStatus({ subscribed: false, error: null, loading: false });
    } catch (error: any) {
      console.error('Unsubscription error:', error);
      setSubscriptionStatus({ subscribed: false, error: error.message, loading: false });
    }
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      {subscriptionStatus.error && <p style={{ color: 'red' }}>Error: {subscriptionStatus.error}</p>}
      {subscriptionStatus.subscribed && <p style={{ color: 'green' }}>Successfully subscribed!</p>}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
        disabled={subscriptionStatus.loading}
      />
      <button onClick={subscribe} disabled={subscriptionStatus.loading}>
        {subscriptionStatus.loading ? 'Subscribing...' : 'Subscribe'}
      </button>
      <button onClick={unsubscribe} disabled={subscriptionStatus.loading}>
        {subscriptionStatus.loading ? 'Unsubscribing...' : 'Unsubscribe'}
      </button>
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx

import { useState, useEffect } from 'react';

interface EmailMarketingProps {
  apiKey: string; // API key for email marketing service (e.g., SendGrid, Mailchimp)
  listId: string; // ID of the mailing list
}

interface SubscriptionStatus {
  subscribed: boolean;
  error: string | null;
  loading: boolean;
}

const EmailMarketing = ({ apiKey, listId }: EmailMarketingProps) => {
  const [email, setEmail] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    error: null,
    loading: false,
  });

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const subscribe = async () => {
    setSubscriptionStatus({ ...subscriptionStatus, loading: true });
    try {
      // Simulate API call to email marketing service
      // Replace with actual API call using fetch or a dedicated library
      const response = await fetch('/api/subscribe', { // Assuming an API endpoint exists
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          apiKey: apiKey,
          listId: listId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Subscription failed');
      }

      setSubscriptionStatus({ subscribed: true, error: null, loading: false });
    } catch (error: any) {
      console.error('Subscription error:', error);
      setSubscriptionStatus({ subscribed: false, error: error.message, loading: false });
    }
  };

  const unsubscribe = async () => {
    setSubscriptionStatus({ ...subscriptionStatus, loading: true });
    try {
      // Simulate API call to email marketing service
      // Replace with actual API call using fetch or a dedicated library
      const response = await fetch('/api/unsubscribe', { // Assuming an API endpoint exists
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          apiKey: apiKey,
          listId: listId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unsubscription failed');
      }

      setSubscriptionStatus({ subscribed: false, error: null, loading: false });
    } catch (error: any) {
      console.error('Unsubscription error:', error);
      setSubscriptionStatus({ subscribed: false, error: error.message, loading: false });
    }
  };

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      {subscriptionStatus.error && <p style={{ color: 'red' }}>Error: {subscriptionStatus.error}</p>}
      {subscriptionStatus.subscribed && <p style={{ color: 'green' }}>Successfully subscribed!</p>}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
        disabled={subscriptionStatus.loading}
      />
      <button onClick={subscribe} disabled={subscriptionStatus.loading}>
        {subscriptionStatus.loading ? 'Subscribing...' : 'Subscribe'}
      </button>
      <button onClick={unsubscribe} disabled={subscriptionStatus.loading}>
        {subscriptionStatus.loading ? 'Unsubscribing...' : 'Unsubscribe'}
      </button>
    </div>
  );
};

export default EmailMarketing;