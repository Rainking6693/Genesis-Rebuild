// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  customerId: string;
}

function StripeBilling({ customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Simulate API call to check subscription status (replace with your actual API endpoint)
        const response = await fetch(`/api/subscriptions?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status); // e.g., "active", "inactive", "trialing"
      } catch (e: any) {
        setError(`Failed to fetch subscription status: ${e.message}`);
        console.error("Error fetching subscription status:", e);
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [customerId]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      // Simulate API call to create a checkout session (replace with your actual API endpoint)
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

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (e: any) {
      setError(`Failed to subscribe: ${e.message}`);
      console.error("Error subscribing:", e);
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
      <h2>Subscription Status: {subscriptionStatus || 'Not Available'}</h2>
      <button onClick={handleSubscribe} disabled={loading || subscriptionStatus === 'active'}>
        {subscriptionStatus === 'active' ? 'Already Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
}

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  customerId: string;
}

function StripeBilling({ customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      setLoading(true);
      try {
        // Simulate API call to check subscription status (replace with your actual API endpoint)
        const response = await fetch(`/api/subscriptions?customerId=${customerId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubscriptionStatus(data.status); // e.g., "active", "inactive", "trialing"
      } catch (e: any) {
        setError(`Failed to fetch subscription status: ${e.message}`);
        console.error("Error fetching subscription status:", e);
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptionStatus();
  }, [customerId]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      // Simulate API call to create a checkout session (replace with your actual API endpoint)
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

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (e: any) {
      setError(`Failed to subscribe: ${e.message}`);
      console.error("Error subscribing:", e);
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
      <h2>Subscription Status: {subscriptionStatus || 'Not Available'}</h2>
      <button onClick={handleSubscribe} disabled={loading || subscriptionStatus === 'active'}>
        {subscriptionStatus === 'active' ? 'Already Subscribed' : 'Subscribe'}
      </button>
    </div>
  );
}

export default StripeBilling;