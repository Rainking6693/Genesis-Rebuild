// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeBillingProps {
  priceId: string;
  customerId?: string; // Optional: If you have an existing customer ID
  onSuccess?: () => void; // Optional: Callback for successful subscription
  onError?: (error: Error) => void; // Optional: Callback for errors
}

function StripeBilling({ priceId, customerId, onSuccess, onError }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if Stripe is loaded
    if (!stripePromise) {
      setError(new Error("Stripe failed to load. Check your API key."));
      return;
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to initialize.");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        mode: 'subscription',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: `${window.location.origin}/success`, // Replace with your success URL
        cancelUrl: `${window.location.origin}/cancel`, // Replace with your cancel URL
        customer: customerId, // Optional: Pass existing customer ID
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (onSuccess) {
        onSuccess();
      }

    } catch (e: any) {
      setError(e);
      if (onError) {
        onError(e);
      }
      console.error("Stripe Billing Error:", e); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error.message}
      </div>
    );
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Loading...' : 'Subscribe'}
    </button>
  );
}

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeBillingProps {
  priceId: string;
  customerId?: string; // Optional: If you have an existing customer ID
  onSuccess?: () => void; // Optional: Callback for successful subscription
  onError?: (error: Error) => void; // Optional: Callback for errors
}

function StripeBilling({ priceId, customerId, onSuccess, onError }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if Stripe is loaded
    if (!stripePromise) {
      setError(new Error("Stripe failed to load. Check your API key."));
      return;
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to initialize.");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        mode: 'subscription',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: `${window.location.origin}/success`, // Replace with your success URL
        cancelUrl: `${window.location.origin}/cancel`, // Replace with your cancel URL
        customer: customerId, // Optional: Pass existing customer ID
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (onSuccess) {
        onSuccess();
      }

    } catch (e: any) {
      setError(e);
      if (onError) {
        onError(e);
      }
      console.error("Stripe Billing Error:", e); // Log the error for debugging
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error.message}
      </div>
    );
  }

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Loading...' : 'Subscribe'}
    </button>
  );
}

export default StripeBilling;

Now, I will use the `Write` tool to write the code to `src/components/StripeBilling.tsx`.