// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeBillingProps {
  customerId: string;
}

export default function StripeBilling({ customerId }: StripeBillingProps) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'loading' | 'error'>('loading');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscriptionStatus() {
      try {
        const response = await fetch('/api/stripe/subscription-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'active') {
          setSubscriptionStatus('active');
        } else {
          setSubscriptionStatus('inactive');
        }
      } catch (e: any) {
        console.error("Failed to fetch subscription status:", e);
        setError("Failed to fetch subscription status. Please try again later.");
        setSubscriptionStatus('error');
      }
    }

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
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

      const stripe = await stripePromise;

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId,
        });

        if (result.error) {
          console.error("Stripe checkout error:", result.error.message);
          setError(result.error.message || "Failed to redirect to checkout.");
        }
      } else {
        setError("Stripe failed to load.");
      }

    } catch (e: any) {
      console.error("Failed to create checkout session:", e);
      setError("Failed to create checkout session. Please try again later.");
    }
  };

  if (subscriptionStatus === 'loading') {
    return <div>Loading subscription status...</div>;
  }

  if (subscriptionStatus === 'error') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {subscriptionStatus === 'active' ? (
        <div>Your subscription is active!</div>
      ) : (
        <button onClick={handleCheckout}>Subscribe Now</button>
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
  const [subscriptionStatus, setSubscriptionStatus] = useState<'active' | 'inactive' | 'loading' | 'error'>('loading');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscriptionStatus() {
      try {
        const response = await fetch('/api/stripe/subscription-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === 'active') {
          setSubscriptionStatus('active');
        } else {
          setSubscriptionStatus('inactive');
        }
      } catch (e: any) {
        console.error("Failed to fetch subscription status:", e);
        setError("Failed to fetch subscription status. Please try again later.");
        setSubscriptionStatus('error');
      }
    }

    fetchSubscriptionStatus();
  }, [customerId]);

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
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

      const stripe = await stripePromise;

      if (stripe) {
        const result = await stripe.redirectToCheckout({
          sessionId,
        });

        if (result.error) {
          console.error("Stripe checkout error:", result.error.message);
          setError(result.error.message || "Failed to redirect to checkout.");
        }
      } else {
        setError("Stripe failed to load.");
      }

    } catch (e: any) {
      console.error("Failed to create checkout session:", e);
      setError("Failed to create checkout session. Please try again later.");
    }
  };

  if (subscriptionStatus === 'loading') {
    return <div>Loading subscription status...</div>;
  }

  if (subscriptionStatus === 'error') {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {subscriptionStatus === 'active' ? (
        <div>Your subscription is active!</div>
      ) : (
        <button onClick={handleCheckout}>Subscribe Now</button>
      )}
    </div>
  );
}