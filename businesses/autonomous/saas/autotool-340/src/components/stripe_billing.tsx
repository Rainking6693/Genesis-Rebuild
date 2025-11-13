// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface Props {
  customerId: string;
  subscriptionId?: string;
  onSubscriptionUpdate?: (subscription: any) => void;
}

const StripeBilling: React.FC<Props> = ({ customerId, subscriptionId, onSubscriptionUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!subscriptionId) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/stripe/subscriptions/${subscriptionId}`); // Assuming you have an API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription: ${response.status}`);
        }
        const data = await response.json();
        setSubscription(data);
        if (onSubscriptionUpdate) {
          onSubscriptionUpdate(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch subscription.');
        console.error("Error fetching subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    if (subscriptionId) {
      fetchSubscription();
    }
  }, [customerId, subscriptionId, onSubscriptionUpdate]);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-manage-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create manage link: ${response.status}`);
      }

      const data = await response.json();
      window.location.href = data.url; // Redirect to Stripe's customer portal
    } catch (err: any) {
      setError(err.message || 'Failed to create manage link.');
      console.error("Error creating manage link:", err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="stripe-billing">
      {loading && <div className="loading">Loading...</div>}
      {subscription ? (
        <div>
          <h3>Subscription Details</h3>
          <p>Status: {subscription.status}</p>
          <p>Current Period End: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>No active subscription found.</p>
      )}
      <button onClick={handleManageSubscription} disabled={loading}>
        Manage Subscription
      </button>
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface Props {
  customerId: string;
  subscriptionId?: string;
  onSubscriptionUpdate?: (subscription: any) => void;
}

const StripeBilling: React.FC<Props> = ({ customerId, subscriptionId, onSubscriptionUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!subscriptionId) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/stripe/subscriptions/${subscriptionId}`); // Assuming you have an API endpoint
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription: ${response.status}`);
        }
        const data = await response.json();
        setSubscription(data);
        if (onSubscriptionUpdate) {
          onSubscriptionUpdate(data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch subscription.');
        console.error("Error fetching subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    if (subscriptionId) {
      fetchSubscription();
    }
  }, [customerId, subscriptionId, onSubscriptionUpdate]);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-manage-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create manage link: ${response.status}`);
      }

      const data = await response.json();
      window.location.href = data.url; // Redirect to Stripe's customer portal
    } catch (err: any) {
      setError(err.message || 'Failed to create manage link.');
      console.error("Error creating manage link:", err);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="stripe-billing">
      {loading && <div className="loading">Loading...</div>}
      {subscription ? (
        <div>
          <h3>Subscription Details</h3>
          <p>Status: {subscription.status}</p>
          <p>Current Period End: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}</p>
        </div>
      ) : (
        <p>No active subscription found.</p>
      )}
      <button onClick={handleManageSubscription} disabled={loading}>
        Manage Subscription
      </button>
    </div>
  );
};

export default StripeBilling;