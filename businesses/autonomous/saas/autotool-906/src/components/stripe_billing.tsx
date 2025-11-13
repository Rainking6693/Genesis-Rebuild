// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeBillingProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export default function StripeBilling({ priceId, successUrl, cancelUrl }: StripeBillingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Stripe is loaded
    if (!stripePromise) {
      setError("Stripe failed to load. Please check your internet connection and try again.");
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Stripe failed to initialize. Please try again later.");
        setIsLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        setError(error.message || "An error occurred during checkout.");
      }
    } catch (e: any) {
      console.error("Error during Stripe checkout:", e);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div style={{ color: 'red' }}>
          Error: {error}
        </div>
      )}

      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Subscribe'}
      </button>
    </div>
  );
}

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeBillingProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export default function StripeBilling({ priceId, successUrl, cancelUrl }: StripeBillingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Stripe is loaded
    if (!stripePromise) {
      setError("Stripe failed to load. Please check your internet connection and try again.");
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Stripe failed to initialize. Please try again later.");
        setIsLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        setError(error.message || "An error occurred during checkout.");
      }
    } catch (e: any) {
      console.error("Error during Stripe checkout:", e);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div style={{ color: 'red' }}>
          Error: {error}
        </div>
      )}

      <button onClick={handleClick} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Subscribe'}
      </button>
    </div>
  );
}