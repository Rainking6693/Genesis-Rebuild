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
    // Check if Stripe is properly initialized
    if (!stripePromise) {
      setError("Stripe failed to initialize. Please check your Stripe key.");
      return;
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Stripe failed to load. Please try again.");
        setLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`, // Replace with your success URL
        cancelUrl: window.location.origin, // Replace with your cancel URL
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        setError(error.message || "An error occurred during checkout.");
      }
    } catch (err: any) {
      console.error("Error during Stripe checkout:", err);
      setError("Failed to initiate checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Pay with Stripe'}
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
    // Check if Stripe is properly initialized
    if (!stripePromise) {
      setError("Stripe failed to initialize. Please check your Stripe key.");
      return;
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError("Stripe failed to load. Please try again.");
        setLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`, // Replace with your success URL
        cancelUrl: window.location.origin, // Replace with your cancel URL
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        setError(error.message || "An error occurred during checkout.");
      }
    } catch (err: any) {
      console.error("Error during Stripe checkout:", err);
      setError("Failed to initiate checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Pay with Stripe'}
      </button>
    </div>
  );
};

export default StripeCheckout;

Now, I'll use the `Write` tool to save this code to `src/components/StripeCheckout.tsx`.

Finally, I'll generate the build report.