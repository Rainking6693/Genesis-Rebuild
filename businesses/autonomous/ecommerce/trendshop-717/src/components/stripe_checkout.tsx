// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripeCheckoutProps {
  priceId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if Stripe is initialized
    if (!stripePromise) {
      setError(new Error("Stripe failed to initialize.  Check your publishable key."));
      return;
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError(new Error("Stripe failed to load."));
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription', // or 'payment' for one-time payments
        successUrl: `${window.location.origin}/success`, // Replace with your success URL
        cancelUrl: `${window.location.origin}/cancel`, // Replace with your cancel URL
      });

      if (error) {
        setError(error);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div style={{ color: 'red' }}>
          Error: {error.message}
        </div>
      )}
      <button role="link" onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Checkout with Stripe'}
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
  onSuccess: () => void;
  onCancel: () => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if Stripe is initialized
    if (!stripePromise) {
      setError(new Error("Stripe failed to initialize.  Check your publishable key."));
      return;
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError(new Error("Stripe failed to load."));
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription', // or 'payment' for one-time payments
        successUrl: `${window.location.origin}/success`, // Replace with your success URL
        cancelUrl: `${window.location.origin}/cancel`, // Replace with your cancel URL
      });

      if (error) {
        setError(error);
      }
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div style={{ color: 'red' }}>
          Error: {error.message}
        </div>
      )}
      <button role="link" onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Checkout with Stripe'}
      </button>
    </div>
  );
};

export default StripeCheckout;

Now, I will use the `Write` tool to save this code to `src/components/StripeCheckout.tsx`.

Finally, I will generate the build report.