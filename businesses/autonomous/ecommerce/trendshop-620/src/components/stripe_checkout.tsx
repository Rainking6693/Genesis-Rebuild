// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeCheckoutProps {
  priceId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if Stripe is loaded
    if (!stripePromise) {
      setError(new Error("Stripe failed to load. Check your publishable key."));
      return;
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError(new Error("Stripe failed to initialize."));
        setLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        successUrl: `${window.location.origin}?success=true`,
        cancelUrl: `${window.location.origin}?canceled=true`,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        setError(error);
      }
    } catch (err) {
      console.error("Error during checkout:", err);
      setError(err instanceof Error ? err : new Error("An unexpected error occurred."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      onSuccess();
    }

    if (urlParams.get('canceled') === 'true') {
      onCancel();
    }
  }, [onSuccess, onCancel]);

  if (error) {
    return (
      <div className="error">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <button role="link" onClick={handleClick} disabled={loading}>
      {loading ? 'Loading...' : 'Checkout'}
    </button>
  );
};

export default StripeCheckout;

// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!); // Replace with your actual key

interface StripeCheckoutProps {
  priceId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if Stripe is loaded
    if (!stripePromise) {
      setError(new Error("Stripe failed to load. Check your publishable key."));
      return;
    }
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await stripePromise;

      if (!stripe) {
        setError(new Error("Stripe failed to initialize."));
        setLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        successUrl: `${window.location.origin}?success=true`,
        cancelUrl: `${window.location.origin}?canceled=true`,
      });

      if (error) {
        console.error("Stripe checkout error:", error);
        setError(error);
      }
    } catch (err) {
      console.error("Error during checkout:", err);
      setError(err instanceof Error ? err : new Error("An unexpected error occurred."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      onSuccess();
    }

    if (urlParams.get('canceled') === 'true') {
      onCancel();
    }
  }, [onSuccess, onCancel]);

  if (error) {
    return (
      <div className="error">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <button role="link" onClick={handleClick} disabled={loading}>
      {loading ? 'Loading...' : 'Checkout'}
    </button>
  );
};

export default StripeCheckout;

Now, I will use the `Write` tool to save the code to a file.

Finally, I will generate the build report.