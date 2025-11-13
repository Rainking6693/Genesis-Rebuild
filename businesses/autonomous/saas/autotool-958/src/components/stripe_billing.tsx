// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeBillingProps {
  priceId: string;
  customerId?: string; // Optional: If you have existing customers
}

function StripeBilling({ priceId, customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Optional: Check customer status or pre-populate data
    // This is a placeholder - replace with your actual logic
    if (customerId) {
      console.log(`Fetching customer details for ${customerId}`);
    }
  }, [customerId]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load. Check your API key.");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        mode: 'subscription', // or 'payment' for one-time payments
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: `${window.location.origin}/success`, // Replace with your success URL
        cancelUrl: `${window.location.origin}/cancel`, // Replace with your cancel URL
        customer: customerId, // Optional: Pass customer ID if available
      });

      if (stripeError) {
        setError(stripeError.message || "An error occurred during checkout.");
      }
    } catch (e: any) {
      console.error("Error during Stripe checkout:", e);
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Subscribe'}
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
  priceId: string;
  customerId?: string; // Optional: If you have existing customers
}

function StripeBilling({ priceId, customerId }: StripeBillingProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Optional: Check customer status or pre-populate data
    // This is a placeholder - replace with your actual logic
    if (customerId) {
      console.log(`Fetching customer details for ${customerId}`);
    }
  }, [customerId]);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        throw new Error("Stripe failed to load. Check your API key.");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        mode: 'subscription', // or 'payment' for one-time payments
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: `${window.location.origin}/success`, // Replace with your success URL
        cancelUrl: `${window.location.origin}/cancel`, // Replace with your cancel URL
        customer: customerId, // Optional: Pass customer ID if available
      });

      if (stripeError) {
        setError(stripeError.message || "An error occurred during checkout.");
      }
    } catch (e: any) {
      console.error("Error during Stripe checkout:", e);
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Subscribe'}
      </button>
    </div>
  );
}

export default StripeBilling;