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
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          setError(new Error('Failed to initialize Stripe.'));
        }
      } catch (err: any) {
        setError(new Error(`Error initializing Stripe: ${err.message}`));
      }
    };

    initializeStripe();
  }, []);

  const handleCheckout = async () => {
    if (!stripe) {
      setError(new Error('Stripe not initialized.'));
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
        setError(new Error(error.message));
      }
    } catch (err: any) {
      setError(new Error(`Checkout error: ${err.message}`));
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error.message}
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleCheckout} disabled={loading}>
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
        if (stripeInstance) {
          setStripe(stripeInstance);
        } else {
          setError(new Error('Failed to initialize Stripe.'));
        }
      } catch (err: any) {
        setError(new Error(`Error initializing Stripe: ${err.message}`));
      }
    };

    initializeStripe();
  }, []);

  const handleCheckout = async () => {
    if (!stripe) {
      setError(new Error('Stripe not initialized.'));
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
        setError(new Error(error.message));
      }
    } catch (err: any) {
      setError(new Error(`Checkout error: ${err.message}`));
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ color: 'red' }}>
        Error: {error.message}
      </div>
    );
  }

  return (
    <div>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Loading...' : 'Checkout with Stripe'}
      </button>
    </div>
  );
};

export default StripeCheckout;

Now, I will use the available tools to write the code to a file and create the build report.

Final Answer: