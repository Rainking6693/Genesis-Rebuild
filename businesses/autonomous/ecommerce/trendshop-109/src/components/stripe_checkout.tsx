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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual key
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          setError("Failed to initialize Stripe.");
        }
      } catch (err: any) {
        setError(`Error initializing Stripe: ${err.message}`);
      }
    };

    initializeStripe();
  }, []);

  const handleCheckout = async () => {
    if (!stripe) {
      setError("Stripe not initialized.");
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
      setError(`Checkout error: ${err.message}`);
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
    <div>
      <button onClick={handleCheckout} disabled={loading || !stripe}>
        {loading ? 'Loading...' : 'Checkout with Stripe'}
      </button>
    </div>
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual key
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          setError("Failed to initialize Stripe.");
        }
      } catch (err: any) {
        setError(`Error initializing Stripe: ${err.message}`);
      }
    };

    initializeStripe();
  }, []);

  const handleCheckout = async () => {
    if (!stripe) {
      setError("Stripe not initialized.");
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
      setError(`Checkout error: ${err.message}`);
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
    <div>
      <button onClick={handleCheckout} disabled={loading || !stripe}>
        {loading ? 'Loading...' : 'Checkout with Stripe'}
      </button>
    </div>
  );
};

export default StripeCheckout;

Now, I will use the `Write` tool to save this code to `src/components/StripeCheckout.tsx` and then generate the build report.