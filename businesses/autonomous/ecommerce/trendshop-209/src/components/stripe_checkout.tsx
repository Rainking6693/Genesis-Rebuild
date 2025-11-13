// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

interface StripeCheckoutProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, successUrl, cancelUrl }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(stripePublishableKey);
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
      setError('Stripe has not initialized yet.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription', // or 'payment' for one-time payments
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(`Checkout failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={handleCheckout} disabled={isLoading || !stripe}>
        {isLoading ? 'Loading...' : 'Checkout with Stripe'}
      </button>
    </div>
  );
};

export default StripeCheckout;

// src/components/StripeCheckout.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

interface StripeCheckoutProps {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ priceId, successUrl, cancelUrl }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(stripePublishableKey);
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
      setError('Stripe has not initialized yet.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription', // or 'payment' for one-time payments
        successUrl: successUrl,
        cancelUrl: cancelUrl,
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(`Checkout failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <button onClick={handleCheckout} disabled={isLoading || !stripe}>
        {isLoading ? 'Loading...' : 'Checkout with Stripe'}
      </button>
    </div>
  );
};

export default StripeCheckout;

generated_code: