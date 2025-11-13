// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface StripeBillingProps {
  customerEmail: string;
  priceId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerEmail, priceId }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual key
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
        mode: 'subscription',
        successUrl: `${window.location.origin}/success`, // Replace with your success URL
        cancelUrl: `${window.location.origin}/cancel`, // Replace with your cancel URL
        customerEmail: customerEmail,
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
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <button onClick={handleCheckout} disabled={!stripe}>
          Subscribe
        </button>
      )}
    </div>
  );
};

export default StripeBilling;

// src/components/StripeBilling.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

interface StripeBillingProps {
  customerEmail: string;
  priceId: string;
}

const StripeBilling: React.FC<StripeBillingProps> = ({ customerEmail, priceId }) => {
  const [stripe, setStripe] = useState<stripe.Stripe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''); // Replace with your actual key
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
        mode: 'subscription',
        successUrl: `${window.location.origin}/success`, // Replace with your success URL
        cancelUrl: `${window.location.origin}/cancel`, // Replace with your cancel URL
        customerEmail: customerEmail,
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
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <button onClick={handleCheckout} disabled={!stripe}>
          Subscribe
        </button>
      )}
    </div>
  );
};

export default StripeBilling;

Now, I will use the `Write` tool to save the code to `src/components/StripeBilling.tsx`.