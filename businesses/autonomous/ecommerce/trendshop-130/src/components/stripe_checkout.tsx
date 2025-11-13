// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface StripeCheckoutProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, successUrl, cancelUrl }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          setError('Failed to initialize Stripe.');
        }
      } catch (err: any) {
        setError(`Error initializing Stripe: ${err.message}`);
      }
    };

    initializeStripe();
  }, []);

  const handleCheckout = async () => {
    if (!stripe) {
      setError('Stripe is not initialized.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(`Error redirecting to checkout: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Loading...' : 'Checkout with Stripe'}
    </button>
  );
};

export default StripeCheckout;

// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface StripeCheckoutProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, successUrl, cancelUrl }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          setError('Failed to initialize Stripe.');
        }
      } catch (err: any) {
        setError(`Error initializing Stripe: ${err.message}`);
      }
    };

    initializeStripe();
  }, []);

  const handleCheckout = async () => {
    if (!stripe) {
      setError('Stripe is not initialized.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(`Error redirecting to checkout: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <button onClick={handleCheckout} disabled={loading}>
      {loading ? 'Loading...' : 'Checkout with Stripe'}
    </button>
  );
};

export default StripeCheckout;

Now, I will use the `Write` tool to save the code to `src/components/StripeCheckout.tsx`.