// src/components/EmailMarketing.tsx

import { useState, useEffect } from 'react';

interface EmailMarketingProps {
  emailServiceProvider: 'SendGrid' | 'Mailchimp' | 'AWS SES'; // Example, can be extended
  apiKey: string;
}

interface SubscriptionStatus {
  subscribed: boolean;
  error: string | null;
  loading: boolean;
}

const EmailMarketing = ({ emailServiceProvider, apiKey }: EmailMarketingProps) => {
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
      // Simulate API call to subscribe user (replace with actual API call)
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, emailServiceProvider, apiKey }),
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

  useEffect(() => {
    // Simulate checking if user is already subscribed (replace with actual API call)
    const checkSubscription = async () => {
      try {
        const response = await fetch(`/api/checkSubscription?email=${email}`);
        if (response.ok) {
          const data = await response.json();
          setSubscriptionStatus({ ...subscriptionStatus, subscribed: data.isSubscribed });
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };

    if (email) {
      checkSubscription();
    }
  }, [email]);

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      {subscriptionStatus.error && <div style={{ color: 'red' }}>Error: {subscriptionStatus.error}</div>}
      {subscriptionStatus.subscribed && <div style={{ color: 'green' }}>You are subscribed!</div>}
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={handleEmailChange}
        disabled={subscriptionStatus.subscribed || subscriptionStatus.loading}
      />
      <button onClick={subscribe} disabled={subscriptionStatus.subscribed || subscriptionStatus.loading}>
        {subscriptionStatus.loading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </div>
  );
};

export default EmailMarketing;

// src/components/EmailMarketing.tsx

import { useState, useEffect } from 'react';

interface EmailMarketingProps {
  emailServiceProvider: 'SendGrid' | 'Mailchimp' | 'AWS SES'; // Example, can be extended
  apiKey: string;
}

interface SubscriptionStatus {
  subscribed: boolean;
  error: string | null;
  loading: boolean;
}

const EmailMarketing = ({ emailServiceProvider, apiKey }: EmailMarketingProps) => {
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
      // Simulate API call to subscribe user (replace with actual API call)
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, emailServiceProvider, apiKey }),
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

  useEffect(() => {
    // Simulate checking if user is already subscribed (replace with actual API call)
    const checkSubscription = async () => {
      try {
        const response = await fetch(`/api/checkSubscription?email=${email}`);
        if (response.ok) {
          const data = await response.json();
          setSubscriptionStatus({ ...subscriptionStatus, subscribed: data.isSubscribed });
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };

    if (email) {
      checkSubscription();
    }
  }, [email]);

  return (
    <div>
      <h2>Subscribe to our Newsletter</h2>
      {subscriptionStatus.error && <div style={{ color: 'red' }}>Error: {subscriptionStatus.error}</div>}
      {subscriptionStatus.subscribed && <div style={{ color: 'green' }}>You are subscribed!</div>}
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={handleEmailChange}
        disabled={subscriptionStatus.subscribed || subscriptionStatus.loading}
      />
      <button onClick={subscribe} disabled={subscriptionStatus.subscribed || subscriptionStatus.loading}>
        {subscriptionStatus.loading ? 'Subscribing...' : 'Subscribe'}
      </button>
    </div>
  );
};

export default EmailMarketing;