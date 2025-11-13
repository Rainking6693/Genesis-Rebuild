// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Ensure env variable is set

interface SubscriptionData {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

interface StripeBillingProps {
  subscriptionData: SubscriptionData;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ subscriptionData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      const { priceId, successUrl, cancelUrl } = subscriptionData;

      const { error: stripeError } = await stripe.redirectToCheckout({
        mode: 'subscription',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err: any) {
      console.error("Stripe checkout error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setError("Stripe publishable key is missing.  Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables.");
    }
  }, []);

  return (
    <div>
      {error && (
        <div style={{ color: 'red' }}>
          Error: {error}
        </div>
      )}

      <button onClick={handleClick} disabled={loading || !!error}>
        {loading ? 'Loading...' : 'Subscribe'}
      </button>
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Ensure env variable is set

interface SubscriptionData {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

interface StripeBillingProps {
  subscriptionData: SubscriptionData;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ subscriptionData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load.");
      }

      const { priceId, successUrl, cancelUrl } = subscriptionData;

      const { error: stripeError } = await stripe.redirectToCheckout({
        mode: 'subscription',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }
    } catch (err: any) {
      console.error("Stripe checkout error:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setError("Stripe publishable key is missing.  Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment variables.");
    }
  }, []);

  return (
    <div>
      {error && (
        <div style={{ color: 'red' }}>
          Error: {error}
        </div>
      )}

      <button onClick={handleClick} disabled={loading || !!error}>
        {loading ? 'Loading...' : 'Subscribe'}
      </button>
    </div>
  );
};

export default StripeBilling;