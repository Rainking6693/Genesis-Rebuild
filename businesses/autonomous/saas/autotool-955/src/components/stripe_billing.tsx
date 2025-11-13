// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'canceled' | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription status
        const response = await fetch(`/api/subscriptions?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status); // Assuming the API returns a 'status' field
      } catch (e: any) {
        setError(e.message || 'Failed to fetch subscription status.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      // Replace with your actual API endpoint to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error("Stripe failed to load.");
      }

    } catch (e: any) {
      setError(e.message || 'Failed to initiate subscription.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint to cancel the subscription
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optionally, update the subscription status after successful cancellation
      setSubscriptionStatus('canceled');
    } catch (e: any) {
      setError(e.message || 'Failed to cancel subscription.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      {subscriptionStatus === 'active' ? (
        <div>
          <p>Your subscription is active.</p>
          <button onClick={handleCancelSubscription} disabled={loading}>
            Cancel Subscription
          </button>
        </div>
      ) : (
        <div>
          <p>You do not have an active subscription.</p>
          <button onClick={handleSubscribe} disabled={loading}>
            Subscribe Now
          </button>
        </div>
      )}
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  customerId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerId }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'canceled' | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription status
        const response = await fetch(`/api/subscriptions?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status); // Assuming the API returns a 'status' field
      } catch (e: any) {
        setError(e.message || 'Failed to fetch subscription status.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      // Replace with your actual API endpoint to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { sessionId } = await response.json();

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error("Stripe failed to load.");
      }

    } catch (e: any) {
      setError(e.message || 'Failed to initiate subscription.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setLoading(true);
    setError(null);

    try {
      // Replace with your actual API endpoint to cancel the subscription
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optionally, update the subscription status after successful cancellation
      setSubscriptionStatus('canceled');
    } catch (e: any) {
      setError(e.message || 'Failed to cancel subscription.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      {subscriptionStatus === 'active' ? (
        <div>
          <p>Your subscription is active.</p>
          <button onClick={handleCancelSubscription} disabled={loading}>
            Cancel Subscription
          </button>
        </div>
      ) : (
        <div>
          <p>You do not have an active subscription.</p>
          <button onClick={handleSubscribe} disabled={loading}>
            Subscribe Now
          </button>
        </div>
      )}
    </div>
  );
};

export default StripeBilling;

Now, I will use the available tools to write the code to a file and generate the build report.

**Final Answer:**