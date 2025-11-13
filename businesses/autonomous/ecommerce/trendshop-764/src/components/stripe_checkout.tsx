// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, successUrl, cancelUrl }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Stripe publishable key is available
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setError("Stripe publishable key is not set in environment variables.");
      return;
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Failed to load Stripe.");
        setLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        mode: 'payment',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (error) {
        console.error(error);
        setError(error.message || "An error occurred during checkout.");
      }
    } catch (e: any) {
      console.error(e);
      setError("Failed to initiate checkout: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button role="link" onClick={handleClick} disabled={loading || error !== null}>
        {loading ? 'Loading...' : 'Checkout'}
      </button>
    </div>
  );
};

export default StripeCheckout;

// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, successUrl, cancelUrl }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Stripe publishable key is available
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setError("Stripe publishable key is not set in environment variables.");
      return;
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Failed to load Stripe.");
        setLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        mode: 'payment',
        lineItems: [{ price: priceId, quantity: 1 }],
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (error) {
        console.error(error);
        setError(error.message || "An error occurred during checkout.");
      }
    } catch (e: any) {
      console.error(e);
      setError("Failed to initiate checkout: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button role="link" onClick={handleClick} disabled={loading || error !== null}>
        {loading ? 'Loading...' : 'Checkout'}
      </button>
    </div>
  );
};

export default StripeCheckout;

Now, I will use the `Write` tool to write the code to the file.