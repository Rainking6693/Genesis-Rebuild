// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  priceId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Stripe is initialized
    if (!stripePromise) {
      setError("Stripe failed to initialize. Check your publishable key.");
      return;
    }

    // Clear any existing errors
    setError(null);
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Stripe failed to load. Please try again.");
        setLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription', // or 'payment' for one-time payments
        successUrl: `${window.location.origin}?success=true`,
        cancelUrl: `${window.location.origin}?canceled=true`,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        setError(error.message || "An error occurred during checkout.");
      }
    } catch (err: any) {
      console.error("Error during Stripe checkout:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handle success and cancel query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      onSuccess();
    }

    if (urlParams.get('canceled') === 'true') {
      onCancel();
    }
  }, [onSuccess, onCancel]);

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={handleClick} disabled={loading || error !== null}>
        {loading ? 'Loading...' : 'Checkout with Stripe'}
      </button>
    </div>
  );
};

export default StripeCheckout;

// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  priceId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if Stripe is initialized
    if (!stripePromise) {
      setError("Stripe failed to initialize. Check your publishable key.");
      return;
    }

    // Clear any existing errors
    setError(null);
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Stripe failed to load. Please try again.");
        setLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription', // or 'payment' for one-time payments
        successUrl: `${window.location.origin}?success=true`,
        cancelUrl: `${window.location.origin}?canceled=true`,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        setError(error.message || "An error occurred during checkout.");
      }
    } catch (err: any) {
      console.error("Error during Stripe checkout:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handle success and cancel query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      onSuccess();
    }

    if (urlParams.get('canceled') === 'true') {
      onCancel();
    }
  }, [onSuccess, onCancel]);

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={handleClick} disabled={loading || error !== null}>
        {loading ? 'Loading...' : 'Checkout with Stripe'}
      </button>
    </div>
  );
};

export default StripeCheckout;

Now, I will use the `Write` tool to save the code to a file and then provide the build report.