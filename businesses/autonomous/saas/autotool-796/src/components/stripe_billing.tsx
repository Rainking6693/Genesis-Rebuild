// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  priceId: string;
  customerId?: string;
}

export default function StripeBilling({ priceId, customerId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!priceId) {
      setError("Price ID is required.");
    }
  }, [priceId]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Stripe failed to load.");
        setLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
        customer: customerId,
      });

      if (error) {
        console.error(error);
        setError(error.message || "An error occurred during checkout.");
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="error">
        Error: {error}
      </div>
    );
  }

  return (
    <button role="link" onClick={handleClick} disabled={loading}>
      {loading ? 'Loading...' : 'Subscribe'}
    </button>
  );
}

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  priceId: string;
  customerId?: string;
}

export default function StripeBilling({ priceId, customerId }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!priceId) {
      setError("Price ID is required.");
    }
  }, [priceId]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Stripe failed to load.");
        setLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/cancel`,
        customer: customerId,
      });

      if (error) {
        console.error(error);
        setError(error.message || "An error occurred during checkout.");
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="error">
        Error: {error}
      </div>
    );
  }

  return (
    <button role="link" onClick={handleClick} disabled={loading}>
      {loading ? 'Loading...' : 'Subscribe'}
    </button>
  );
}

Now, I will use the `Write` tool to save the code to `src/components/StripeBilling.tsx` and the build report to `build_reports/stripe_billing.json`.