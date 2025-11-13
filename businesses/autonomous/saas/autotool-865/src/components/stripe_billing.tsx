// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeBillingProps {
  customerId: string;
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription status
        const response = await fetch(`/api/subscriptions/${customerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch subscription status.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      // Replace with your actual API endpoint to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.status}`);
      }

      const { sessionId } = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Stripe Billing</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {loading && <div>Loading...</div>}

      {subscriptionStatus ? (
        <div>Subscription Status: {subscriptionStatus}</div>
      ) : (
        <button onClick={handleCheckout} disabled={loading}>
          Subscribe Now
        </button>
      )}
    </div>
  );
}

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeBillingProps {
  customerId: string;
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint to fetch subscription status
        const response = await fetch(`/api/subscriptions/${customerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch subscription status.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      // Replace with your actual API endpoint to create a checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.status}`);
      }

      const { sessionId } = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Stripe Billing</h2>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {loading && <div>Loading...</div>}

      {subscriptionStatus ? (
        <div>Subscription Status: {subscriptionStatus}</div>
      ) : (
        <button onClick={handleCheckout} disabled={loading}>
          Subscribe Now
        </button>
      )}
    </div>
  );
}

Now, I will use the tools to write the code and output the build report.